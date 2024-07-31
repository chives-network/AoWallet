
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
    }
  });

  chrome.storage.sync.set({ key: value }).then(() => {
    console.log("Value is set");
  });
  
  chrome.storage.sync.get(["key"]).then((result) => {
    console.log("Value is " + result.key);
  });


