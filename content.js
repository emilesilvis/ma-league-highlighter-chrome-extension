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

// Function to show only one lesson at a time (hide text of other lessons)
function updateSingleLessonMode(singleLessonMode) {
  const incompleteTasks = document.querySelectorAll('#incompleteTasks .taskUnlocked');
  
  let lessonCount = 0;
  
  incompleteTasks.forEach((task) => {
    // Check if this is a lesson (not a review)
    const taskTypeElement = task.querySelector('.taskTypeUnlocked');
    const isLesson = taskTypeElement && taskTypeElement.textContent.trim() === 'Lesson';
    
    if (isLesson) {
      lessonCount++;
      
      if (singleLessonMode && lessonCount > 1) {
        // Hide only the lesson name/text, keep everything else
        const taskNameElement = task.querySelector('.taskNameUnlocked');
        if (taskNameElement) {
          taskNameElement.style.display = 'none';
        }
      } else {
        // Show the lesson name normally
        const taskNameElement = task.querySelector('.taskNameUnlocked');
        if (taskNameElement) {
          taskNameElement.style.display = '';
        }
      }
    }
    // Don't touch reviews - they should always be fully visible
  });
}

// Function to move reviews to the top
function updateReviewsToTop(reviewsToTop) {
  const incompleteTasks = document.querySelector('#incompleteTasks');
  if (!incompleteTasks) return;
  
  if (reviewsToTop) {
    console.log('Moving reviews to top');
    
    // Find all review tasks
    const allTasks = Array.from(incompleteTasks.querySelectorAll('.taskUnlocked'));
    const reviewTasks = [];
    const nonReviewTasks = [];
    
    allTasks.forEach(task => {
      const taskTypeElement = task.querySelector('.taskTypeUnlocked');
      if (taskTypeElement && taskTypeElement.textContent.trim() === 'Review') {
        reviewTasks.push(task);
      } else {
        nonReviewTasks.push(task);
      }
    });
    
    console.log(`Found ${reviewTasks.length} reviews and ${nonReviewTasks.length} other tasks`);
    
    // Remove all tasks from their current positions
    allTasks.forEach(task => task.remove());
    
    // Add reviews first, then other tasks
    reviewTasks.forEach(task => incompleteTasks.appendChild(task));
    nonReviewTasks.forEach(task => incompleteTasks.appendChild(task));
    
  } else {
    console.log('Restoring original task order');
    // We could implement order restoration, but for now, just refresh the page
    // since Math Academy likely loads tasks in a specific order
  }
}

// Initial highlight, zen mode, and other settings when page loads
chrome.storage.sync.get(['username', 'zenMode', 'hideAllXP', 'singleLessonMode', 'reviewsToTop'], function(result) {
  console.log('Loading initial settings:', result);
  
  if (result.username) {
    highlightUsername(result.username);
  }
  if (result.zenMode) {
    updateZenMode(result.zenMode);
  }
  if (result.hideAllXP) {
    updateXPVisibility(result.hideAllXP);
  }
  if (result.reviewsToTop) {
    updateReviewsToTop(result.reviewsToTop);
  }
  if (result.singleLessonMode) {
    updateSingleLessonMode(result.singleLessonMode);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Received message:', request);
  
  if (request.action === 'updateHighlight') {
    highlightUsername(request.username);
  } else if (request.action === 'updateZenMode') {
    updateZenMode(request.zenMode);
  } else if (request.action === 'updateXPVisibility') {
    updateXPVisibility(request.hideAllXP);
  } else if (request.action === 'updateSingleLessonMode') {
    updateSingleLessonMode(request.singleLessonMode);
  } else if (request.action === 'updateReviewsToTop') {
    updateReviewsToTop(request.reviewsToTop);
  }
});

// Watch for dynamic content changes
const observer = new MutationObserver(function(mutations) {
  chrome.storage.sync.get(['username', 'zenMode', 'hideAllXP', 'singleLessonMode', 'reviewsToTop'], function(result) {
    if (result.username) {
      highlightUsername(result.username);
    }
    if (result.zenMode) {
      updateZenMode(result.zenMode);
    }
    if (result.hideAllXP) {
      updateXPVisibility(result.hideAllXP);
    }
    if (result.reviewsToTop) {
      updateReviewsToTop(result.reviewsToTop);
    }
    if (result.singleLessonMode) {
      updateSingleLessonMode(result.singleLessonMode);
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