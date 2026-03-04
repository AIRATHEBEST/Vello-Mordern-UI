# Vello AI - Complete Testing Guide

## Overview
Vello AI is now a fully integrated intelligent command center with:
- **12 Embedded Capabilities** - All accessible from the search bar
- **Multi-Provider API Support** - Ollama, OpenAI, Anthropic, Gemini, HuggingFace
- **File Attachment System** - Support for images, documents, data files, and code
- **Intelligent Intent Routing** - Automatic capability and provider selection
- **Real-time Capability Detection** - Shows matched capability as you type

---

## Test 1: Intelligent Intent Detection

### Test Case 1.1: Code Generation
**Prompt:** "write python code to analyze sales data from csv file"

**Expected Result:**
- Capability detected: `data_handling` (60% match) or `code_execution` (higher match)
- Provider: `ollama` (default) or intelligent selection
- File types suggested: `data`, `code`

**Status:** ✅ PASSED
- The system correctly detected "data handling" capability with 60% confidence
- Provider defaulted to Ollama
- System recognized CSV file handling

### Test Case 1.2: Text Generation
**Prompt:** "write a professional blog post about AI trends"

**Expected Result:**
- Capability detected: `text_generation`
- Provider: `ollama`
- Confidence: 70%+

### Test Case 1.3: Image Analysis
**Prompt:** "analyze this screenshot and extract the data"

**Expected Result:**
- Capability detected: `multimodal`
- Provider: `openai` or `anthropic` (if configured)
- File types: `image`
- Confidence: 80%+

---

## Test 2: File Attachment System

### Test Case 2.1: Attach CSV File
1. Click the "Attach file" button (Upload icon)
2. Select a CSV file
3. Verify file appears in the attachments list
4. File shows: name, size, and type indicator

**Expected Result:** ✅ File successfully attached
- Shows "1 file attached"
- Displays filename and size
- Has remove button (X)

### Test Case 2.2: Multiple File Attachments
1. Click "Attach file" again
2. Select an image file
3. Verify both files appear in the list

**Expected Result:** ✅ Multiple files supported
- Shows "2 files attached"
- Both files listed with individual remove buttons

### Test Case 2.3: File Type Detection
- Image files → detected as "image"
- CSV/JSON files → detected as "data"
- Python/JS files → detected as "code"
- PDF/TXT files → detected as "document"

---

## Test 3: Multi-Provider Configuration

### Test Case 3.1: Open Provider Settings
1. Click the "Provider Settings" button (Sliders icon) in header
2. Verify all 5 providers are listed:
   - Ollama (Local) - Enabled
   - OpenAI - Disabled (not configured)
   - Anthropic Claude - Disabled
   - Google Gemini - Disabled
   - Hugging Face - Disabled

**Expected Result:** ✅ Provider panel opens correctly

### Test Case 3.2: Configure OpenAI
1. Click "Configure" button for OpenAI
2. Enter a test API key
3. Click "Save"
4. Verify OpenAI status changes to "Configured"

**Expected Result:** ✅ Configuration saved to localStorage

### Test Case 3.3: Switch Providers
1. In the main command center, type a prompt
2. Verify provider selector appears (if multiple providers enabled)
3. Select different providers from dropdown
4. Verify selection persists

---

## Test 4: Capability Routing

### Test Case 4.1: Autonomous Task Execution
**Prompt:** "execute a data pipeline to process customer records"

**Expected Capability:** `autonomous_execution`
**Expected Provider:** `ollama`

### Test Case 4.2: Web Automation
**Prompt:** "scrape product information from the website"

**Expected Capability:** `web_automation`
**Expected Provider:** `ollama` (with web automation logic)

### Test Case 4.3: AI Reasoning
**Prompt:** "reason through this business problem and provide analysis"

**Expected Capability:** `ai_reasoning`
**Expected Provider:** `ollama` or `openai` (if configured)

### Test Case 4.4: Multimodal (with file)
1. Attach an image file
2. Type: "analyze this image and describe what you see"
3. Verify capability switches to `multimodal`
4. Provider should prefer OpenAI/Anthropic if available

---

## Test 5: Real-Time Capability Detection

### Test Case 5.1: Dynamic Capability Switching
1. Start typing: "write"
   - Capability: `text_generation`
2. Continue: "write python"
   - Capability: `code_execution` (higher confidence)
3. Continue: "write python code to analyze"
   - Capability: `code_execution` or `data_handling`

**Expected Result:** ✅ Capability updates in real-time as you type

### Test Case 5.2: Confidence Scoring
- Verify confidence percentage updates
- Confidence should increase as more keywords match
- Max confidence: 100%

---

## Test 6: Quick Actions

### Test Case 6.1: Quick Action Buttons
Click each quick action button:
1. "Analyze this data" → Should trigger `data_handling`
2. "Write a blog post" → Should trigger `text_generation`
3. "Generate Python code" → Should trigger `code_execution`
4. "Create a workflow" → Should trigger `workflow_automation`

**Expected Result:** ✅ Each button correctly routes to its capability

---

## Test 7: UI/UX Features

### Test Case 7.1: Minimalist Design
- Header is clean and compact
- Command center is centered and focused
- Capability preview shows below input
- File attachments display cleanly

### Test Case 7.2: Animations & Transitions
- Smooth fade-in for capability preview
- Smooth dropdown for suggestions
- Modal opens/closes smoothly
- Hover effects on buttons

### Test Case 7.3: Dark Mode
- All text is readable on black background
- Proper contrast ratios maintained
- Accent colors (blue/purple) stand out

---

## Test 8: Error Handling

### Test Case 8.1: Missing API Key
1. Try to use OpenAI without configuring API key
2. Verify error message appears
3. Suggest configuration

### Test Case 8.2: File Upload Error
1. Try to upload unsupported file type
2. Verify error handling
3. Allow retry

### Test Case 8.3: Provider Unavailable
1. Disable all providers
2. Try to submit a prompt
3. Verify fallback to Ollama

---

## Test 9: Performance

### Test Case 9.1: Intent Detection Speed
- Capability detection should be <100ms
- No lag while typing

### Test Case 9.2: File Upload Speed
- Small files (<5MB) should upload instantly
- Large files should show progress

### Test Case 9.3: Provider Switching
- Switching providers should be instant
- No page reload required

---

## Test 10: Integration Testing

### Test Case 10.1: End-to-End Flow
1. Type a prompt: "write python code to analyze sales.csv"
2. Attach a CSV file
3. Verify capability: `code_execution` or `data_handling`
4. Verify provider: `ollama`
5. Verify file attachment shows
6. Click submit
7. Verify request is sent with all data

### Test Case 10.2: Multi-Provider Flow
1. Configure OpenAI with API key
2. Type prompt requiring vision: "analyze this screenshot"
3. Attach image
4. Verify provider automatically switches to OpenAI
5. Submit and verify response

---

## Quick Reference: Capability Keywords

| Capability | Keywords |
|---|---|
| Autonomous Execution | execute, run, automate, workflow, pipeline, process, task, schedule |
| Text Generation | write, generate, create, compose, article, blog, essay, report, document |
| Code Execution | code, python, javascript, function, script, program, debug |
| Data Handling | data, analyze, csv, json, excel, dataset, statistics |
| Web Automation | browse, scrape, extract, website, web, url, fetch, crawl |
| AI Reasoning | reason, analyze, think, problem, solve, logic, explain |
| Multimodal | image, photo, screenshot, visual, diagram, picture, video |
| Haptics | gesture, hand, motion, haptic, vr, ar, touch, finger |
| Workflow Automation | workflow, automate, integration, api, connect, sync, trigger |
| Memory & Personalization | remember, preference, save, profile, personalize, customize |
| Deliverables | generate, export, download, create, build, component, output |
| Collaboration | team, share, workspace, collaborate, member, permission, access |

---

## Troubleshooting

### Issue: Capability not detecting correctly
- **Solution:** Check keyword matching in `advanced-intent-router.ts`
- Ensure file types are being detected properly

### Issue: Provider not switching
- **Solution:** Verify provider is enabled in configuration
- Check localStorage for saved provider selection

### Issue: File attachment not working
- **Solution:** Verify file type is supported
- Check browser console for errors
- Ensure file size is reasonable

### Issue: Slow performance
- **Solution:** Clear browser cache
- Check network speed
- Verify provider API is responsive

---

## Success Criteria

✅ All 12 capabilities are embedded and accessible  
✅ File attachment system works with multiple file types  
✅ Multi-provider system supports 5+ providers  
✅ Intelligent routing selects correct capability 90%+ of the time  
✅ Real-time detection shows capability as user types  
✅ UI is minimalist and responsive  
✅ All tests pass without errors  
✅ Performance is smooth (<100ms for detection)  

---

## Next Steps

1. **Puppeteer Integration** - Add autonomous web browsing capability
2. **Advanced Analytics** - Track capability usage and accuracy
3. **Custom Workflows** - Allow users to create custom capability chains
4. **API Rate Limiting** - Implement usage tracking and limits
5. **Caching** - Cache responses for common queries
6. **Batch Processing** - Support processing multiple files at once

