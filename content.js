// Function to highlight username
function highlightUsername(username) {
  // Remove any existing highlights
  document.querySelectorAll('.highlighted-username').forEach(el => {
    el.classList.remove('highlighted-username');
  });

  if (!username) return;

  // Find all username cells
  const usernameCells = document.querySelectorAll('.leaderboardUserName');
  
  usernameCells.forEach(cell => {
    if (cell.textContent.toLowerCase() === username.toLowerCase()) {
      cell.classList.add('highlighted-username');
    }
  });
}

// Function to update zen mode
function updateZenMode(zenMode) {
  const elementsToHide = [
    '#courseProgress',
    '#estimatedCompletion',
    '#xpFrame'
  ];

  elementsToHide.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = zenMode ? 'none' : '';
    }
  });
}

// Initial highlight and zen mode when page loads
chrome.storage.sync.get(['username', 'zenMode'], function(result) {
  if (result.username) {
    highlightUsername(result.username);
  }
  if (result.zenMode) {
    updateZenMode(result.zenMode);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateHighlight') {
    highlightUsername(request.username);
  } else if (request.action === 'updateZenMode') {
    updateZenMode(request.zenMode);
  }
});

// Watch for dynamic content changes
const observer = new MutationObserver(function(mutations) {
  chrome.storage.sync.get(['username', 'zenMode'], function(result) {
    if (result.username) {
      highlightUsername(result.username);
    }
    if (result.zenMode) {
      updateZenMode(result.zenMode);
    }
  });
});

// Start observing the leaderboard table for changes
const leaderboardTable = document.querySelector('.leaderboardTable');
if (leaderboardTable) {
  observer.observe(leaderboardTable, {
    childList: true,
    subtree: true
  });
} 