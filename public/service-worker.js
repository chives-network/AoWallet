// Open the extension popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'openPopup') {
      console.log('Background script received message to open popup');
      chrome.action.openPopup();
      sendResponse({ openPopup: true });
  }
});

// Check installation
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkInstallation') {
      sendResponse({ installed: true });
  }
});

// getPermissions
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getPermissions') {
      sendResponse({ result: ['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'DISPATCH', 'ACCESS_ALL_ADDRESSES'] });
  }
});

// getActiveAddress
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getActiveAddress') {
      chrome.storage.sync.get('ChivesCurrentWallet', (result) => {
        sendResponse(result);
      });
      return true;
  }
});

// getAllAddresses
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getAllAddresses') {
      chrome.storage.sync.get('ChivesWalletNickname', (result) => {
        sendResponse(result);
      });
      return true;
  }
});

// getWalletNames
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getWalletNames') {
    chrome.storage.sync.get('ChivesWalletNickname', (result) => {
      sendResponse(result);
    });
    return true;
  }
});

// getMyContacts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getMyContacts') {
    chrome.storage.sync.get('ChivesContacts', (result) => {
      sendResponse(result);
    });
    return true;
  }
});

// getMyTokens
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getMyTokens') {
    chrome.storage.sync.get('ChivesMyAoTokens', (result) => {
      sendResponse(result);
    });
    return true;
  }
});

// getMyLanguageMyTokens
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getMyLanguageMyTokens') {
    chrome.storage.sync.get('ChivesLanguage', (result) => {
      sendResponse(result);
    });
    return true;
  }
});

// getArweaveConfig
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getArweaveConfig') {
      sendResponse({ result: 'NOT_SUPPORT' });
  }
});

// getActivePublicKey
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getActivePublicKey') {
    chrome.storage.sync.get('ChivesCurrentWallet', (result) => {
      sendResponse(result);
    });
    return true;
  }
});

// signature
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'signature') {
      sendResponse({ result: 'NOT_SUPPORT' });
  }
});

// encrypt
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'encrypt') {
      sendResponse({ result: 'NOT_SUPPORT' });
  }
});

// decrypt
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'decrypt') {
      sendResponse({ result: 'NOT_SUPPORT' });
  }
});