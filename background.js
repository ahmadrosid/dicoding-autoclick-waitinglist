chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        chrome.storage.local.get(
          ["isProcessing", "processed", "total"],
          (data) => {
            if (data.isProcessing && data.processed < data.total) {
              const buttons = Array.from(
                document.querySelectorAll("button")
              ).filter((button) =>
                button.textContent.trim().includes("Tambah Ke Event")
              );

              if (buttons.length > 0) {
                // Update progress
                const newProcessed = data.processed + 1;
                chrome.storage.local.set({ processed: newProcessed });

                // Click next button if not finished
                if (newProcessed < data.total) {
                  setTimeout(() => {
                    buttons[newProcessed].click();
                  }, 1000);
                } else {
                  // Reset when finished
                  chrome.storage.local.set({ isProcessing: false });
                }
              }
            }
          }
        );
      },
    });
  }
});
