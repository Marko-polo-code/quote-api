const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));
app.use(express.json());  // Middleware to parse JSON request bodies

app.get('/api/quotes/random', (req, res) => {
  const randomQuote = getRandomElement(quotes);
  res.send({ quote: randomQuote });
});

app.get('/api/quotes', (req, res) => {
  if (req.query.person) {
    const personQuote = req.query.person.toLowerCase();
    const quotesByPerson = quotes.filter(quote => quote.person.toLowerCase() === personQuote);
    res.send({ quotes: quotesByPerson });
  } else {
    res.send({ quotes });
  }
});

app.post('/api/quotes', (req, res) => {
  const { quote, person } = req.body;
  if (quote && person) {
    const newId = quotes.length ? quotes[quotes.length - 1].id + 1 : 1;
    const newQuoteObject = { quote, person, id: newId };
    quotes.push(newQuoteObject);
    res.status(201).send({ quote: newQuoteObject });
  } else {
    res.status(400).send();
  }
});

app.put('/api/quotes/:id', (req, res) => {
  const quoteId = parseInt(req.params.id);
  const { quote, person } = req.body;

  if (isNaN(quoteId) || !quote || !person) {
    return res.status(400).send();
  }

  const quoteIndex = quotes.findIndex(q => q.id === quoteId);
  if (quoteIndex === -1) {
    return res.status(404).send();
  }

  quotes[quoteIndex] = { quote, person, id: quoteId };
  res.send({ quote: quotes[quoteIndex] });
});

app.delete('/api/quotes/:id', (req, res) => {
  const quoteId = parseInt(req.params.id);
  const quoteIndex = quotes.findIndex(q => q.id === quoteId);

  if (quoteIndex === -1) {
    return res.status(404).send();
  }

  quotes.splice(quoteIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
