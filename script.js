//  Handle rating selection per category
document.querySelectorAll('.category').forEach(category => {
  const buttons = category.querySelectorAll('button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Deselect all buttons in the category
      buttons.forEach(b => b.classList.remove('selected', 'good', 'bad'));

      // Apply selection and sentiment color
      button.classList.add('selected');

      const value = button.textContent.toLowerCase();
      if (value === 'excellent' || value === 'good') {
        button.classList.add('good'); // Blue
      } else if (value === 'bad' || value === 'very bad') {
        button.classList.add('bad'); // Red
      }

      // Remove any category highlight (validation)
      category.classList.remove('highlight');
    });
  });
});

//  Form submission with validation and anti-duplication
document.getElementById('evaluation-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const categories = document.querySelectorAll('.category');
  const results = {};
  let allSelected = true;

  // Validate category ratings
  categories.forEach(cat => {
    const categoryName = cat.dataset.category;
    const selected = cat.querySelector('.selected');
    if (selected) {
      results[categoryName] = selected.textContent;
    } else {
      allSelected = false;
      cat.classList.add('highlight');
    }
  });

  // Validate Ethereum wallet input
  const walletInput = document.getElementById('wallet').value.trim();
  const validWallet = /^0x[a-fA-F0-9]{40}$/.test(walletInput);

  if (!allSelected || !validWallet) {
    let message = "";
    if (!allSelected) message += "⚠️ Please rate all four categories.\n";
    if (!validWallet) message += "⚠️ Enter a valid Ethereum wallet address (e.g., 0x...).";
    alert(message);
    return;
  }

  // Check for duplicate wallet vote
  let allVotes = JSON.parse(localStorage.getItem('votes')) || [];
  const alreadyVoted = allVotes.some(entry =>
    entry.wallet?.toLowerCase() === walletInput.toLowerCase()
  );

  if (alreadyVoted) {
    alert("🚫 This wallet has already voted. Only one submission allowed per address.");
    return;
  }

  results.wallet = walletInput;

  // Save vote
  allVotes.push(results);
  localStorage.setItem('votes', JSON.stringify(allVotes));

  // Redirect to poll results
  window.location.href = 'poll.html';
});

//  Reset form selections
document.getElementById('reset-btn').addEventListener('click', () => {
  document.querySelectorAll('.selected').forEach(btn =>
    btn.classList.remove('selected', 'good', 'bad')
  );
  document.querySelectorAll('.category').forEach(cat =>
    cat.classList.remove('highlight')
  );
  document.getElementById('wallet').value = '';
});





