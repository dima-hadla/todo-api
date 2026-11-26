const express = require('express');

const router = express.Router();

// The todos are kept in memory, so they reset every time the server restarts.
// Each todo looks like this: { id: 1, title: 'Read the README', done: true }
let todos = [
  { id: 1, title: 'Read the README', done: true },
  { id: 2, title: 'Build the todo API', done: false },
];
let nextId = 3;

// =====================================================================
// PART 1: build these (see "Part 1: Build the API" in README.md)
// =====================================================================

// GET /todos: list all todos.
// This one is done for you, as an example.
router.get('/', (req, res) => {
  res.json(todos);
});

// POST /todos: create a todo.
// TODO: see "1. Create a todo" in README.md
router.post('/', (req, res) => {
  // Validate and trim the todo title.
  const title = req.body?.title;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  // Create a new todo with a unique ID.
  const newTodo = {
    id: nextId++,
    title: title.trim(),
    done: false,
  };

  todos.push(newTodo);

  return res.status(201).json(newTodo);
});

// PATCH /todos/:id: change a todo's title and/or mark it done.
// TODO: see "2. Update a todo" in README.md
router.patch('/:id', (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));

  // Check whether the todo exists.
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Validate the request body.
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const hasTitle = Object.hasOwn(body, 'title');
  const hasDone = Object.hasOwn(body, 'done');

  // Require at least one field to update.
  if (!hasTitle && !hasDone) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  // Validate the title if provided.
  if (hasTitle &&
    (typeof body.title !== 'string' || body.title.trim() === '')) {
    return res.status(400).json({ error: 'Invalid title' });
  }

  // Validate the done value if provided.
  if (hasDone && typeof body.done !== 'boolean') {
    return res.status(400).json({ error: 'Invalid done value' });
  }

  // Update only the fields provided.
  if (hasTitle) {
    todo.title = body.title.trim();
  }

  if (hasDone) {
    todo.done = body.done;
  }

  return res.status(200).json(todo);
});

// DELETE /todos/:id: delete a todo.
// TODO: see "3. Delete a todo" in README.md
router.delete('/:id', (req, res) => {
  const todoIndex = todos.findIndex(
    (t) => t.id === Number(req.params.id)
  );

  // Check whether the todo exists.
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Remove the todo from the array.
  todos.splice(todoIndex, 1);

  return res.status(204).end();
});

// =====================================================================
// PART 2: review this (see "Part 2: Review the AI's code" in README.md)
//
// We asked an AI assistant:
//   "Add an endpoint that returns one todo by its id, and an endpoint that
//    returns stats: how many todos there are, how many are done, and the
//    percentage that are done."
//
// This is the code it wrote. It looks reasonable, but it has at least
// three bugs. Find them, fix them, and describe each one in your notes.
// =====================================================================



// GET /todos/stats: count the todos
router.get('/stats', (req, res) => {
  const done = todos.filter((t) => t.done).length;

  // Calculate the percentage safely.
  const percentDone = todos.length === 0
    ? 0
    : Math.round((done / todos.length) * 100);

  res.json({
    total: todos.length,
    done: done,
    percentDone: percentDone,
  });
});
// GET /todos/:id: get one todo
router.get('/:id', (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  return res.json({
    id: todo.id,
    title: todo.title,
    done: todo.done,
  });
});

module.exports = router;
