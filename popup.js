document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get(['username', 'zenMode', 'hideAllXP', 'singleLessonMode', 'reviewsToTop'], function(result) {
    if (result.username) {
      document.getElementById('username').value = result.username;
    }
    if (result.zenMode) {
      document.getElementById('zenMode').checked = result.zenMode;
    }
    if (result.hideAllXP) {
      document.getElementById('hideAllXP').checked = result.hideAllXP;
    }
    if (result.singleLessonMode) {
      document.getElementById('singleLessonMode').checked = result.singleLessonMode;
    }
    if (result.reviewsToTop) {
      document.getElementById('reviewsToTop').checked = result.reviewsToTop;
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
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateZenMode', zenMode: zenMode });
      });
    });
  });

  // Handle hide all XP toggle
  document.getElementById('hideAllXP').addEventListener('change', function() {
    const hideAllXP = this.checked;
    chrome.storage.sync.set({ hideAllXP: hideAllXP }, function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateXPVisibility', hideAllXP: hideAllXP });
      });
    });
  });

  // Handle single lesson mode toggle
  document.getElementById('singleLessonMode').addEventListener('change', function() {
    const singleLessonMode = this.checked;
    chrome.storage.sync.set({ singleLessonMode: singleLessonMode }, function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateSingleLessonMode', singleLessonMode: singleLessonMode });
      });
    });
  });

  // Handle reviews to top toggle
  document.getElementById('reviewsToTop').addEventListener('change', function() {
    const reviewsToTop = this.checked;
    chrome.storage.sync.set({ reviewsToTop: reviewsToTop }, function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateReviewsToTop', reviewsToTop: reviewsToTop });
      });
    });
  });
});