
document.addEventListener('DOMContentLoaded', async () => {
    const startButton = document.getElementById('startBatch');
    const stopButton = document.getElementById('stopBatch');
    const status = document.getElementById('status');
    const progress = document.getElementById('progress');
  
    // Check current status
    const data = await chrome.storage.local.get(['isProcessing', 'processed', 'total']);
    updateUI(data.isProcessing, data.processed, data.total);
  
    startButton.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        try {
          // First, set up a listener for tab updates
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === 'complete') {
              // When page is done loading, execute the next click
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                  chrome.storage.local.get(['processed', 'total'], (data) => {
                    if (data.processed < data.total) {
                      const buttons = Array.from(document.querySelectorAll('button')).filter(
                        button => button.textContent.trim().includes('Tambah Ke Event')
                      );
                      if (buttons.length > 0) {
                        const newProcessed = data.processed + 1;
                        chrome.storage.local.set({ processed: newProcessed }, () => {
                          if (newProcessed < data.total) {
                            buttons[0].click();
                          }
                        });
                      }
                    }
                  });
                }
              });
            }
          });
    
          // Initial execution
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              const buttons = Array.from(document.querySelectorAll('button')).filter(
                button => button.textContent.trim().includes('Tambah Ke Event')
              );
              
              chrome.storage.local.set({ 
                isProcessing: true,
                processed: 0,
                total: buttons.length
              }, () => {
                if (buttons.length > 0) {
                  buttons[0].click();
                }
              });
            }
          });
          
          updateUI(true, 0, 0);
        } catch (err) {
          status.textContent = 'Error: ' + err.message;
        }
    });
  
    stopButton.addEventListener('click', async () => {
      await chrome.storage.local.set({ isProcessing: false });
      updateUI(false, 0, 0);
    });
  
    function updateUI(isProcessing, processed, total) {
      startButton.disabled = isProcessing;
      stopButton.disabled = !isProcessing;
      status.textContent = isProcessing ? 'Processing...' : 'Ready';
      if (total > 0) {
        progress.textContent = `Progress: ${processed}/${total}`;
      } else {
        progress.textContent = '';
      }
    }
  
    // Listen for updates from content script
    chrome.storage.onChanged.addListener((changes) => {
      const isProcessing = changes.isProcessing?.newValue ?? false;
      const processed = changes.processed?.newValue ?? 0;
      const total = changes.total?.newValue ?? 0;
      updateUI(isProcessing, processed, total);
    });
  });