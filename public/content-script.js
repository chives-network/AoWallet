console.log("Message from content-script.js")

chrome.runtime.onMessage.addListener(async (request, sender, response) => {
    console.log("request", request);
  
    if (request.action == "CHANGE_BACKGROUND") {
        updatePageBackground()
    }
    if (request.action == "SAY_HELLO") {
      sayHello()
    }
    
  })