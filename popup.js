document.addEventListener('DOMContentLoaded', function() {
  // Load saved username
  chrome.storage.sync.get(['username'], function(result) {
    if (result.username) {
      document.getElementById('username').value = result.username;
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
}); 