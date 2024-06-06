const fetchAllButton = document.getElementById('fetch-quotes');
const fetchRandomButton = document.getElementById('fetch-random');
const fetchByAuthorButton = document.getElementById('fetch-by-author');

const quoteContainer = document.getElementById('quote-container');

const resetQuotes = () => {
  quoteContainer.innerHTML = '';
}

const renderError = response => {
  quoteContainer.innerHTML = `<p>Your request returned an error from the server:</p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
}

const renderQuotes = (quotes = []) => {
  resetQuotes();
  if (quotes.length > 0) {
    quotes.forEach(quote => {
      const newQuote = document.createElement('div');
      newQuote.className = 'single-quote';
      newQuote.dataset.id = quote.id;
      newQuote.innerHTML = `
        <div class="quote-text">${quote.quote}</div>
        <div class="attribution">- ${quote.person}</div>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>`;
      newQuote.querySelector('.edit').addEventListener('click', () => { editQuote(quote.id); });
      newQuote.querySelector('.delete').addEventListener('click', () => { deleteQuote(quote.id); });
      quoteContainer.appendChild(newQuote);
    });
  } else {
    quoteContainer.innerHTML = '<p>Your request returned no quotes.</p>';
  }
}

const editQuote = id => {
  fetch(`/api/quotes/${id}`)
    .then(response => response.ok ? response.json() : renderError(response))
    .then(response => {
      const quote = response.quote;
      const singleQuote = quoteContainer.querySelector(`.single-quote[data-id="${id}"]`);
      const editContainer = document.createElement('div');
      editContainer.className = 'edit-container';
      editContainer.innerHTML = `
        <input type="text" class="edit-quote" value="${quote.quote}">
        <input type="text" class="edit-person" value="${quote.person}">
        <button class="save">Save</button>
        <button class="cancel">Cancel</button>`;
      editContainer.querySelector('.save').addEventListener('click', () => { saveQuote(id); });
      editContainer.querySelector('.cancel').addEventListener('click', () => { cancelEdit(singleQuote); });
      singleQuote.appendChild(editContainer);
    });
}

const cancelEdit = singleQuote => {
  const editContainer = singleQuote.querySelector('.edit-container');
  if (editContainer) {
    singleQuote.removeChild(editContainer);
  }
}

const saveQuote = id => {
  const singleQuote = document.querySelector(`.single-quote[data-id="${id}"]`);
  const editedQuote = singleQuote.querySelector('.edit-quote').value;
  const editedPerson = singleQuote.querySelector('.edit-person').value;

  fetch(`/api/quotes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quote: editedQuote, person: editedPerson })
  })
  .then(response => response.ok ? response.json() : renderError(response))
  .then(updatedQuote => {
    if (updatedQuote) {
      singleQuote.querySelector('.quote-text').textContent = updatedQuote.quote;
      singleQuote.querySelector('.attribution').textContent = `- ${updatedQuote.person}`;
      cancelEdit(singleQuote);
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

const deleteQuote = id => {
  fetch(`/api/quotes/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      document.querySelector(`.single-quote[data-id="${id}"]`).remove();
    } else {
      renderError(response);
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

fetchAllButton.addEventListener('click', () => {
  fetch('/api/quotes')
    .then(response => response.ok ? response.json() : renderError(response))
    .then(response => renderQuotes(response.quotes));
});

fetchRandomButton.addEventListener('click', () => {
  fetch('/api/quotes/random')
    .then(response => response.ok ? response.json() : renderError(response))
    .then(response => renderQuotes([response.quote]));
});

fetchByAuthorButton.addEventListener('click', () => {
  const author = document.getElementById('author').value;
  fetch(`/api/quotes?person=${author}`)
    .then(response => response.ok ? response.json() : renderError(response))
    .then(response => renderQuotes(response.quotes));
});
