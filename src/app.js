const path = require('path');
const express = require('express');
const todosRouter = require('./todos');

const app = express();

// Lets Express read JSON request bodies into req.body
app.use(express.json());

// Serves the web page in the public/ folder at http://localhost:3000
app.use(express.static(path.join(__dirname, '..', 'public')));

// Every URL that starts with /todos is handled in src/todos.js
app.use('/todos', todosRouter);

// Any other URL gets a 404 with a JSON error
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error handler: runs when something throws, or when a request body isn't valid JSON
app.use((err, req, res, next) => {
  // A response was already sent, so let Express log the error and stop
  if (res.headersSent) {
    return next(err);
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

module.exports = app;
