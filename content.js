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

// Function to show only one lesson at a time
function updateSingleLessonMode(singleLessonMode) {
  const incompleteTasks = document.querySelectorAll('#incompleteTasks .taskUnlocked');
  
  incompleteTasks.forEach((task, index) => {
    if (singleLessonMode && index > 0) {
      task.style.display = 'none';
    } else {
      task.style.display = '';
    }
  });
}
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

// Function to hide/show all XP
function updateXPVisibility(hideXP) {
  // Hide XP in leaderboard
  const xpCells = document.querySelectorAll('.leaderboardTable .leaderboarduserPoints');
  xpCells.forEach(cell => {
    cell.style.display = hideXP ? 'none' : '';
  });

  // Hide XP in incomplete lessons (but keep visible in completed lessons)
  const incompleteLessons = document.querySelectorAll('#incompleteTasks .taskPointsUnlocked');
  incompleteLessons.forEach(cell => {
    cell.style.display = hideXP ? 'none' : '';
  });

  // Hide any table headers that might contain "XP"
  const headerCells = document.querySelectorAll('.leaderboardTable th');
  headerCells.forEach(cell => {
    if (cell.textContent.trim().toLowerCase().includes('xp')) {
      cell.style.display = hideXP ? 'none' : '';
    }
  });

  // Add classes for CSS-based hiding
  const leaderboardTable = document.querySelector('.leaderboardTable');
  if (leaderboardTable) {
    if (hideXP) {
      leaderboardTable.classList.add('hide-xp');
    } else {
      leaderboardTable.classList.remove('hide-xp');
    }
  }

  const incompleteTasks = document.querySelector('#incompleteTasks');
  if (incompleteTasks) {
    if (hideXP) {
      incompleteTasks.classList.add('hide-xp');
    } else {
      incompleteTasks.classList.remove('hide-xp');
    }
  }
}

// Initial highlight, zen mode, and other settings when page loads
chrome.storage.sync.get(['username', 'zenMode', 'hideAllXP', 'singleLessonMode', 'twoColumnLayout'], function(result) {
  if (result.username) {
    highlightUsername(result.username);
  }
  if (result.zenMode) {
    updateZenMode(result.zenMode);
  }
  if (result.hideAllXP) {
    updateXPVisibility(result.hideAllXP);
  }
  if (result.singleLessonMode) {
    updateSingleLessonMode(result.singleLessonMode);
  }
  if (result.twoColumnLayout) {
    updateTwoColumnLayout(result.twoColumnLayout);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateHighlight') {
    highlightUsername(request.username);
  } else if (request.action === 'updateZenMode') {
    updateZenMode(request.zenMode);
  } else if (request.action === 'updateXPVisibility') {
    updateXPVisibility(request.hideAllXP);
  } else if (request.action === 'updateSingleLessonMode') {
    updateSingleLessonMode(request.singleLessonMode);
  } else if (request.action === 'updateTwoColumnLayout') {
    updateTwoColumnLayout(request.twoColumnLayout);
  }
});

// Watch for dynamic content changes
const observer = new MutationObserver(function(mutations) {
  chrome.storage.sync.get(['username', 'zenMode', 'hideAllXP', 'singleLessonMode', 'twoColumnLayout'], function(result) {
    if (result.username) {
      highlightUsername(result.username);
    }
    if (result.zenMode) {
      updateZenMode(result.zenMode);
    }
    if (result.hideAllXP) {
      updateXPVisibility(result.hideAllXP);
    }
    if (result.singleLessonMode) {
      updateSingleLessonMode(result.singleLessonMode);
    }
    if (result.twoColumnLayout) {
      updateTwoColumnLayout(result.twoColumnLayout);
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