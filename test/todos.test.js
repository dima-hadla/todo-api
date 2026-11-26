// Run with: npm test
// Uses Node's built-in test runner, so there's nothing extra to install.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;

// Start the app on a random free port before the tests, and stop it after
before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => {
  server.close();
});

test('GET /todos returns a list of todos', async () => {
  const res = await fetch(`${baseUrl}/todos`);

  assert.equal(res.status, 200);
  const todos = await res.json();
  assert.ok(Array.isArray(todos));
});

// Optional: add your own tests below.

// Test POST /todos with a valid title.
test('POST /todos creates a new todo', async () => {
  const res = await fetch(`${baseUrl}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Learn Express' }),
  });

  assert.equal(res.status, 201);

  const todo = await res.json();

  assert.equal(todo.title, 'Learn Express');
  assert.equal(todo.done, false);
  assert.ok(typeof todo.id === 'number');
});

// Test POST /todos with an invalid title.
test('POST /todos rejects an empty title', async () => {
  const res = await fetch(`${baseUrl}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '   ' }),
  });

  assert.equal(res.status, 400);
});

// Test GET /todos/:id with an existing todo.
test('GET /todos/:id returns one todo', async () => {
  const res = await fetch(`${baseUrl}/todos/1`);

  assert.equal(res.status, 200);

  const todo = await res.json();

  assert.equal(todo.id, 1);
  assert.equal(todo.title, 'Read the README');
  assert.equal(todo.done, true);
});

// Test GET /todos/:id with a missing todo.
test('GET /todos/:id returns 404 for a missing todo', async () => {
  const res = await fetch(`${baseUrl}/todos/999`);

  assert.equal(res.status, 404);

  const body = await res.json();

  assert.equal(body.error, 'Todo not found');
});

// Test GET /todos/stats.
test('GET /todos/stats returns correct statistics', async () => {
  const res = await fetch(`${baseUrl}/todos/stats`);

  assert.equal(res.status, 200);

  const stats = await res.json();

  assert.deepEqual(stats, {
    total: 3,
    done: 1,
    percentDone: 33,
  });
});

// Test PATCH /todos/:id.
test('PATCH /todos/:id updates a todo', async () => {
  const res = await fetch(`${baseUrl}/todos/2`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Updated todo',
      done: true,
    }),
  });

  assert.equal(res.status, 200);

  const todo = await res.json();

  assert.equal(todo.title, 'Updated todo');
  assert.equal(todo.done, true);
});

// Test PATCH /todos/:id with an invalid title.
test('PATCH /todos/:id rejects an empty title', async () => {
  const res = await fetch(`${baseUrl}/todos/2`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '   ' }),
  });

  assert.equal(res.status, 400);
});

// Test PATCH /todos/:id with an empty body.
test('PATCH /todos/:id rejects an empty update', async () => {
  const res = await fetch(`${baseUrl}/todos/2`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(res.status, 400);
});

// Test PATCH /todos/:id with a missing todo.
test('PATCH /todos/:id returns 404 for a missing todo', async () => {
  const res = await fetch(`${baseUrl}/todos/999`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: true }),
  });

  assert.equal(res.status, 404);
});

// Test DELETE /todos/:id.
test('DELETE /todos/:id deletes a todo', async () => {
  const res = await fetch(`${baseUrl}/todos/2`, {
    method: 'DELETE',
  });

  assert.equal(res.status, 204);
  assert.equal(await res.text(), '');
});

// Test DELETE /todos/:id with a missing todo.
test('DELETE /todos/:id returns 404 for a missing todo', async () => {
  const res = await fetch(`${baseUrl}/todos/2`, {
    method: 'DELETE',
  });

  assert.equal(res.status, 404);
});

// Test GET /todos/stats when there are no todos.
test('GET /todos/stats handles an empty todo list', async () => {
  // Delete the todo created by the POST test.
  await fetch(`${baseUrl}/todos/3`, {
    method: 'DELETE',
  });

  // Delete the remaining original todo.
  await fetch(`${baseUrl}/todos/1`, {
    method: 'DELETE',
  });

  const res = await fetch(`${baseUrl}/todos/stats`);

  assert.equal(res.status, 200);

  const stats = await res.json();

  assert.deepEqual(stats, {
    total: 0,
    done: 0,
    percentDone: 0,
  });
});
