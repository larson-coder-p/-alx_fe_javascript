// Default quotes if no localStorage data
const defaultQuotes = [
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'Motivation' },
  { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { text: 'Do not watch the clock. Do what it does. Keep going.', category: 'Motivation' },
  { text: 'In the middle of difficulty lies opportunity.', category: 'Inspiration' }
];

let quotes = [];
let filteredQuotes = []; // Quotes filtered by category

// Load quotes from localStorage or default
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  quotes = stored ? JSON.parse(stored) : [...defaultQuotes];
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))].sort();

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category or default to "all"
  const savedCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = savedCategory;
}

// Display a random quote from filteredQuotes
function displayFilteredQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available for this category.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;

  // Save last viewed quote index in sessionStorage for this filter
  sessionStorage.setItem('lastViewedQuoteIndex', randomIndex);
}

// Filter quotes based on selected category and display one
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);

  filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  displayFilteredQuote();
}

// Add a new quote and update storage and UI
function addQuote() {
  const quoteTextInput = document.getElementById('newQuoteText');
  const quoteCategoryInput = document.getElementById('newQuoteCategory');
  const quoteText = quoteTextInput.value.trim();
  const quoteCategory = quoteCategoryInput.value.trim();

  if (!quoteText || !quoteCategory) {
    alert('Please enter both a quote and a category.');
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  saveQuotes();

  // Clear inputs
  quoteTextInput.value = '';
  quoteCategoryInput.value = '';

  // Update categories dropdown and refresh filtered quotes
  populateCategories();
  filterQuotes();
}

// Show a new random quote in the current filter
function showNewQuote() {
  if (!filteredQuotes || filteredQuotes.length === 0) {
    filterQuotes(); // Initialize filteredQuotes if empty
  } else {
    displayFilteredQuote();
  }
}

// Export quotes as JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategories();
        filterQuotes();
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Error parsing JSON file.');
    }
  };
  if (event.target.files[0]) {
    fileReader.readAsText(event.target.files[0]);
  }
}

// Initialization on page load
window.onload = function() {
  loadQuotes();
  populateCategories();
  filterQuotes();

  // Attach event listeners
  document.getElementById('newQuote').addEventListener('click', showNewQuote);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
  document.getElementById('exportBtn').addEventListener('click', exportQuotes);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
};
