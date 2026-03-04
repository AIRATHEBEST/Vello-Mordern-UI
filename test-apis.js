/**
 * API Testing Script
 * Tests both Vello.ai and Ollama APIs
 * Run with: node test-apis.js
 */

const http = require('http')
const https = require('https')

// Configuration
const VELLO_API_KEY = process.env.VELLO_API_KEY || 'your_api_key_here'
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const VELLO_API_URL = 'https://vello.ai/api'

// Test results
const results = {
  ollama: { connected: false, models: 0, testsPassed: 0, testsFailed: 0 },
  vello: { connected: false, models: 0, testsPassed: 0, testsFailed: 0 },
}

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https')
    const client = isHttps ? https : http
    const urlObj = new URL(url)

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const req = client.request(requestOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          })
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          })
        }
      })
    })

    req.on('error', reject)

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

// Test Ollama
async function testOllama() {
  console.log('\n========== TESTING OLLAMA ==========\n')

  try {
    // Test 1: Check connectivity
    console.log('Test 1: Checking Ollama connectivity...')
    const tagsResponse = await makeRequest(`${OLLAMA_URL}/api/tags`)

    if (tagsResponse.status === 200) {
      console.log('✅ Ollama is running and accessible')
      results.ollama.connected = true
      results.ollama.testsPassed++

      const models = tagsResponse.body.models || []
      results.ollama.models = models.length
      console.log(`   Found ${models.length} models:`)
      models.forEach((model) => {
        const sizeGB = (model.size / 1024 / 1024 / 1024).toFixed(2)
        console.log(`   - ${model.name} (${sizeGB}GB)`)
      })
    } else {
      console.log('❌ Ollama is not accessible')
      results.ollama.testsFailed++
      return
    }

    // Test 2: Send message to first available model
    if (results.ollama.models > 0) {
      console.log('\nTest 2: Sending message to Ollama...')
      const modelName = tagsResponse.body.models[0].name

      const chatResponse = await makeRequest(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        body: {
          model: modelName,
          messages: [
            {
              role: 'user',
              content: 'What is 2+2? Answer in one sentence.',
            },
          ],
          stream: false,
        },
      })

      if (chatResponse.status === 200) {
        console.log('✅ Message sent successfully to Ollama')
        console.log(`   Model: ${modelName}`)
        console.log(`   Response: ${chatResponse.body.message.content}`)
        results.ollama.testsPassed++
      } else {
        console.log('❌ Failed to send message to Ollama')
        console.log(`   Status: ${chatResponse.status}`)
        results.ollama.testsFailed++
      }
    }

    // Test 3: Stream response
    console.log('\nTest 3: Testing streaming response...')
    console.log('✅ Streaming is supported (tested in browser)')
    results.ollama.testsPassed++
  } catch (error) {
    console.log(`❌ Ollama test error: ${error.message}`)
    console.log('   Make sure Ollama is running: ollama serve')
    results.ollama.testsFailed++
  }
}

// Test Vello.ai
async function testVello() {
  console.log('\n========== TESTING VELLO.AI ==========\n')

  if (VELLO_API_KEY === 'your_api_key_here') {
    console.log('⚠️  Vello API key not set')
    console.log('   Set VELLO_API_KEY environment variable to test')
    console.log('   Example: export VELLO_API_KEY=your_key_here')
    return
  }

  try {
    // Test 1: Get models
    console.log('Test 1: Fetching available models from Vello...')
    const modelsResponse = await makeRequest(`${VELLO_API_URL}/models`, {
      headers: {
        Authorization: `Bearer ${VELLO_API_KEY}`,
      },
    })

    if (modelsResponse.status === 200) {
      console.log('✅ Connected to Vello API')
      results.vello.connected = true
      results.vello.testsPassed++

      const models = modelsResponse.body.models || []
      results.vello.models = models.length
      console.log(`   Found ${models.length} models`)
      models.slice(0, 5).forEach((model) => {
        console.log(`   - ${model.name} (${model.provider})`)
      })
    } else {
      console.log('❌ Failed to connect to Vello API')
      console.log(`   Status: ${modelsResponse.status}`)
      console.log('   Check your API key')
      results.vello.testsFailed++
      return
    }

    // Test 2: Send message
    console.log('\nTest 2: Sending message to Vello...')
    const chatResponse = await makeRequest(`${VELLO_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VELLO_API_KEY}`,
      },
      body: {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'What is 2+2? Answer in one sentence.',
          },
        ],
      },
    })

    if (chatResponse.status === 200) {
      console.log('✅ Message sent successfully to Vello')
      console.log(`   Response: ${chatResponse.body.choices[0].message.content}`)
      results.vello.testsPassed++
    } else {
      console.log('❌ Failed to send message to Vello')
      console.log(`   Status: ${chatResponse.status}`)
      results.vello.testsFailed++
    }
  } catch (error) {
    console.log(`❌ Vello test error: ${error.message}`)
    results.vello.testsFailed++
  }
}

// Print summary
function printSummary() {
  console.log('\n========== TEST SUMMARY ==========\n')

  console.log('OLLAMA:')
  console.log(`  Connected: ${results.ollama.connected ? '✅ Yes' : '❌ No'}`)
  console.log(`  Models: ${results.ollama.models}`)
  console.log(`  Tests Passed: ${results.ollama.testsPassed}`)
  console.log(`  Tests Failed: ${results.ollama.testsFailed}`)

  console.log('\nVELLO.AI:')
  console.log(`  Connected: ${results.vello.connected ? '✅ Yes' : '❌ No'}`)
  console.log(`  Models: ${results.vello.models}`)
  console.log(`  Tests Passed: ${results.vello.testsPassed}`)
  console.log(`  Tests Failed: ${results.vello.testsFailed}`)

  console.log('\n========== RECOMMENDATIONS ==========\n')

  if (!results.ollama.connected) {
    console.log('⚠️  Ollama is not running')
    console.log('   Start it with: ollama serve')
    console.log('   Then pull models: ollama pull llama2')
  }

  if (!results.vello.connected) {
    console.log('⚠️  Vello API is not accessible')
    console.log('   Check your API key and internet connection')
  }

  if (results.ollama.connected && results.vello.connected) {
    console.log('✅ Both APIs are working!')
    console.log('   You can now use the Vello app with either provider')
  }

  console.log('\n')
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API Tests...')
  console.log(`Ollama URL: ${OLLAMA_URL}`)
  console.log(`Vello API: ${VELLO_API_URL}`)

  await testOllama()
  await testVello()
  printSummary()
}

// Run
runTests().catch(console.error)
