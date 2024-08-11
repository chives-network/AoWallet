// Open the extension popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'Open_Popup') {
      console.log('Background script received message to open popup');
      chrome.action.openPopup();
      sendResponse({ openPopup: true });
  }
});

// Check installation
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'Check_Installation') {
      sendResponse({ installed: true });
  }
});


