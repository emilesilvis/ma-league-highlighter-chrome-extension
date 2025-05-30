document.addEventListener('DOMContentLoaded', function() {
  // Load saved username and zen mode state
  chrome.storage.sync.get(['username', 'zenMode'], function(result) {
    if (result.username) {
      document.getElementById('username').value = result.username;
    }
    if (result.zenMode) {
      document.getElementById('zenMode').checked = result.zenMode;
    }
  });

  // Save username when button is clicked
  document.getElementById('save').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    if (username) {
      chrome.storage.sync.set({ username: username }, function() {
        // Notify content script to update highlighting
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'updateHighlight', username: username });
        });
      });
    }
  });

  // Handle zen mode toggle
  document.getElementById('zenMode').addEventListener('change', function() {
    const zenMode = this.checked;
    chrome.storage.sync.set({ zenMode: zenMode }, function() {
      // Notify content script to update zen mode
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateZenMode', zenMode: zenMode });
      });
    });
  });
}); 