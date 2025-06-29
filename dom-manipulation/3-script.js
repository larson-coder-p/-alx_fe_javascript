// Simulated server data (initially same as defaultQuotes)
let serverQuotes = [
  { id: 1, text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'Motivation' },
  { id: 2, text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { id: 3, text: 'Do not watch the clock. Do what it does. Keep going.', category: 'Motivation' },
  { id: 4, text: 'In the middle of difficulty lies opportunity.', category: 'Inspiration' }
];

// Local quotes with unique IDs
let quotes = [];
let nextLocalId = 5; // To assign new IDs locally

// Load local quotes from storage or initialize
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  quotes = stored ? JSON.parse(stored) : [...serverQuotes];
  // Adjust nextLocalId to avoid ID conflicts
  const maxId = quotes.reduce((max, q) => Math.max(max, q.id || 0), 0);
  nextLocalId = maxId + 1;
}

// Save local quotes to storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Simulate fetching quotes from "server" with delay
function fetchServerQuotes() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...serverQuotes]); // Return a copy
    }, 1000); // Simulate 1s network delay
  });
}

// Simulate posting updated quotes to server
function postQuotesToServer(updatedQuotes) {
  return new Promise(resolve => {
    setTimeout(() => {
      // Overwrite server data with updated quotes
      serverQuotes = [...updatedQuotes];
      resolve({ success: true });
    }, 1000);
  });
}

// Merge server and local quotes with conflict resolution
function syncWithServer() {
  fetchServerQuotes().then(serverData => {
    // Conflict detection: check for differences
    // Strategy: server data takes precedence

    // Find quotes in server not in local (by id)
    const serverIds = new Set(serverData.map(q => q.id));
    const localIds = new Set(quotes.map(q => q.id));

    // Quotes only on server (new quotes)
    const newFromServer = serverData.filter(q => !localIds.has(q.id));

    // Quotes only on local (new quotes locally added)
    const newLocal = quotes.filter(q => !serverIds.has(q.id));

    // Quotes present in both but differing text/category
    const conflicts = [];
    const mergedQuotes = [];

    serverData.forEach(serverQuote => {
      const localQuote = quotes.find(q => q.id === serverQuote.id);
      if (!localQuote) {
        // New quote from server
        mergedQuotes.push(serverQuote);
      } else {
        // Check for conflict
        if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
          conflicts.push({ local: localQuote, server: serverQuote });
          // Resolve by taking server version
          mergedQuotes.push(serverQuote);
        } else {
          mergedQuotes.push(localQuote);
        }
      }
    });

    // Add new local quotes (not on server)
    mergedQuotes.push(...newLocal);

    // Update local quotes and save
    quotes = mergedQuotes;
    saveQuotes();

    // Notify user if conflicts resolved
    if (conflicts.length > 0) {
      showConflictNotification(conflicts.length);
    }

    // Refresh UI (filter categories, quotes, etc.)
    populateCategories();
    filterQuotes();
  });
}

// Show notification about conflicts resolved
function showConflictNotification(conflictCount) {
  const notificationId = 'conflictNotification';
  let notification = document.getElementById(notificationId);

  if (!notification) {
    notification = document.createElement('div');
    notification.id = notificationId;
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = '10px';
    notification.style.backgroundColor = '#f87171'; // red-400
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    notification.style.zIndex = 1000;

    // Add manual refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh Now';
    refreshBtn.style.marginLeft = '12px';
    refreshBtn.style.backgroundColor = 'white';
    refreshBtn.style.color = '#b91c1c'; // red-700
    refreshBtn.style.border = 'none';
    refreshBtn.style.padding = '6px 12px';
    refreshBtn.style.borderRadius = '6px';
    refreshBtn.style.cursor = 'pointer';

    refreshBtn.onclick = () => {
      notification.remove();
      syncWithServer();
    };

    notification.appendChild(document.createTextNode(`⚠️ ${conflictCount} conflict(s) resolved. Server data applied.`));
    notification.appendChild(refreshBtn);
    document.body.appendChild(notification);

    // Auto-hide after 15 seconds
    setTimeout(() => {
      if (notification.parentNode) notification.parentNode.removeChild(notification);
    }, 15000);
  }
}

// Add quote locally and sync to server
function addQuote() {
  const quoteTextInput = document.getElementById('newQuoteText');
  const quoteCategoryInput = document.getElementById('newQuoteCategory');
  const quoteText = quoteTextInput.value.trim();
  const quoteCategory = quoteCategoryInput.value.trim();

  if (!quoteText || !quoteCategory) {
    alert('Please enter both a quote and a category.');
    return;
  }

  const newQuote = { id: nextLocalId++, text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  saveQuotes();

  // Clear inputs
  quoteTextInput.value = '';
  quoteCategoryInput.value = '';

  // Update categories and UI
  populateCategories();
  filterQuotes();

  // Push update to server asynchronously
  postQuotesToServer(quotes).then(response => {
    if (response.success) {
      console.log('Server updated successfully.');
    }
  });
}

// Periodically sync with server every 30 seconds
setInterval(syncWithServer, 30000);

// Initial load and setup
window.onload = () => {
  loadQuotes();
  populateCategories();
  filterQuotes();

  // Attach event listeners
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
  document.getElementById('newQuote').addEventListener('click', () => {
    displayFilteredQuote();
  });

  // Initial sync with server
  syncWithServer();
};
