
// Page request to open popup
window.addEventListener('message', function(event) {
  if (event.source !== window) return;
  if (event.data.type && (event.data.type === 'Chrome_Open_Extension_defmalnpgnhpcoaadaohehpdaodpfjla')) {
      console.log('Content script received message to open extension popup');
      chrome.runtime.sendMessage({ action: 'Open_Popup' });
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


