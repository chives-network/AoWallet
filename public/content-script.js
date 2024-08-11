
window.addEventListener('message', function(event) {
  if (event.source !== window) return;
  const callID = event.data.callID
  const ext = event.data.ext
  const type = event.data.type
  const origin = event.data.origin
  const isTrusted = event.data.isTrusted
  const permissions = (event.data.data && event.data.data.params && event.data.data.params[0]) ?? [];
  const name = (event.data.data && event.data.data.params && event.data.data.params[1]) ?? 'AoWalletExample';
  console.log("type", type, permissions, ext)
  if (type && (type === 'api_connect')) {
    chrome.runtime.sendMessage({ action: "Open_Popup" }, (response) => {
      console.log("Extension Open_Popup is open:", response);
    });
  }

});



window.addEventListener('message', function(event) {
  if (event.source !== window) return;
  if (event.data.type && (event.data.type === 'connect_result')) {
      console.log('connect_result');
  }
});

window.addEventListener('message', function(event) {
  if (event.source !== window) return;
  if (event.data.type && (event.data.type === 'arconnect_event')) {
      console.log('arconnect_event');
  }
});





// Page request to open popup
window.addEventListener('message', function(event) {
  if (event.source !== window) return;
  if (event.data.type && (event.data.type === 'Chrome_Open_Extension_defmalnpgnhpcoaadaohehpdaodpfjla')) {
      console.log('Content script received message to open extension popup');
      //chrome.runtime.sendMessage({ action: 'Open_Popup' });
  }
});

// Content-Script request service-worker to check extension installation
window.addEventListener('message', function(event) {
  if (event.source !== window) return;
  if (event.data.type && (event.data.type === 'Chrome_Check_Extension_Installation_defmalnpgnhpcoaadaohehpdaodpfjla')) {
      console.log('Content script received message to check extension installation');
      chrome.runtime.sendMessage({ action: 'Check_Installation' }, function(response) {
          window.postMessage({ type: 'Chrome_Extension_Installation_Status_defmalnpgnhpcoaadaohehpdaodpfjla', installed: response.installed }, '*');
      });
  }
});


