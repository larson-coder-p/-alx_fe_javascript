// Default quotes (used if no localStorage data)
const defaultQuotes = [
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'Motivation' },
  { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { text: 'Do not watch the clock. Do what it does. Keep going.', category: 'Motivation' },
  { text: 'In the middle of difficulty lies opportunity.', category: 'Inspiration' }
];

// Load quotes from localStorage or use defaults
let quotes = [];
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  quotes = stored ? JSON.parse(stored) : [...defaultQuotes];
}
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote and save index to sessionStorage
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
  sessionStorage.setItem('lastViewedQuote', randomIndex);
}

// Add new quote
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

  quoteTextInput.value = '';
  quoteCategoryInput.value = '';
  showRandomQuote();
}

// Export quotes as JSON
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
        showRandomQuote();
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

// Restore last viewed quote from sessionStorage (optional)
function restoreLastViewedQuote() {
  const idx = sessionStorage.getItem('lastViewedQuote');
  if (idx !== null && quotes[idx]) {
    const quote = quotes[idx];
    document.getElementById('quoteDisplay').textContent = `"${quote.text}" - ${quote.category}`;
  } else {
    showRandomQuote();
  }
}

// Attach event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
document.getElementById('exportBtn').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize app
window.onload = function() {
  loadQuotes();
  restoreLastViewedQuote();
};
