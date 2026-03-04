// Vello AI Intelligence OS Background Script

chrome.runtime.onInstalled.addListener(() => {
  console.log('Vello AI Intelligence OS installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_MODELS') {
    // Fetch models from Supabase
    fetch('https://oredszasbvkvejvbooki.supabase.co/rest/v1/models', {
      headers: {
        'apikey': 'your_anon_key',
        'Authorization': 'Bearer your_anon_key'
      }
    })
      .then(r => r.json())
      .then(data => sendResponse({ models: data }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});
