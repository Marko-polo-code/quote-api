const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

app.get('/api/quotes/random', (req, res, next) => {
  const randomQuote = getRandomElement(quotes);
  res.send({ quote: randomQuote });
});

app.get('/api/quotes', (req, res, next) => {
  if (req.query.person) {
    const personQuote = req.query.person.toLowerCase();
    const quotesByPerson = quotes.filter(quote => quote.person.toLowerCase() === personQuote);
    res.send({ quotes: quotesByPerson });
  } else {
    res.send({ quotes: quotes });
  }
});

app.post('/api/quotes', (req, res, next) => {
  const newQuote = req.query.quote;
  const newPerson = req.query.person;
  if (newQuote && newPerson) {
    quotes.push({ quote: newQuote, person: newPerson });
    res.status(201).send({ quote: { quote: newQuote, person: newPerson } });
  } else {
    res.status(400).send();
  }
});

app.listen(PORT, () => { console.log(`Server is listening on port ${PORT}`); });
