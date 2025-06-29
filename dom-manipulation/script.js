// Array to hold quote objects
const quotes = [
    { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'Motivation' },
    { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
    { text: 'Do not watch the clock. Do what it does. Keep going.', category: 'Motivation' },
    { text: 'In the middle of difficulty lies opportunity.', category: 'Inspiration' }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length === 0) {
      quoteDisplay.textContent = 'No quotes available.';
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
  }
  
  // Function to add a new quote dynamically
  function addQuote() {
    const quoteTextInput = document.getElementById('newQuoteText');
    const quoteCategoryInput = document.getElementById('newQuoteCategory');
    const quoteText = quoteTextInput.value.trim();
    const quoteCategory = quoteCategoryInput.value.trim();
  
    if (!quoteText || !quoteCategory) {
      alert('Please enter both a quote and a category.');
      return;
    }
  
    // Add new quote to the quotes array
    quotes.push({ text: quoteText, category: quoteCategory });
  
    // Clear input fields
    quoteTextInput.value = '';
    quoteCategoryInput.value = '';
  
    // Display the newly added quote
    showRandomQuote();
  }
  
  // Attach event listeners
  const newQuoteBtn = document.getElementById('newQuote');
  newQuoteBtn.addEventListener('click', showRandomQuote);
  
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  addQuoteBtn.addEventListener('click', addQuote);
  
  // Show an initial quote on page load
  window.onload = showRandomQuote;
  