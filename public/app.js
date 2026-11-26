// This file runs in the browser. You don't need to change it,
// but reading it shows exactly which requests your API will receive.

const form = document.querySelector('#new-todo-form');
const input = document.querySelector('#new-todo-title');
const list = document.querySelector('#todo-list');
const message = document.querySelector('#message');
const summary = document.querySelector('#summary');

// Sends a request to the API and returns the JSON response.
// If the API answers with an error status, shows the error on the page.
async function api(method, url, body) {
  const options = { method, headers: {} };
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  let data = null;
  if (res.status !== 204) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const reason = data && data.error ? data.error : res.statusText;
    throw new Error(`${method} ${url} returned ${res.status}: ${reason}`);
  }
  return data;
}

function showError(error) {
  message.textContent = error.message;
  message.hidden = false;
}

function clearError() {
  message.hidden = true;
  message.textContent = '';
}

// Runs an API action, then reloads the list so the page always shows what the server has
async function run(action) {
  try {
    await action();
    clearError();
  } catch (error) {
    showError(error);
  }
  await loadTodos();
}

async function loadTodos() {
  try {
    const todos = await api('GET', '/todos');
    if (!Array.isArray(todos)) {
      throw new Error('GET /todos should return a JSON array');
    }
    render(todos);
  } catch (error) {
    showError(error);
  }
}

function render(todos) {
  list.replaceChildren(...todos.map(renderTodo));

  const doneCount = todos.filter((todo) => todo.done).length;
  summary.textContent = todos.length === 0 ? 'Nothing to do!' : `${doneCount} of ${todos.length} done`;
}

function renderTodo(todo) {
  const item = document.createElement('li');
  item.className = todo.done ? 'todo done' : 'todo';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = Boolean(todo.done);
  checkbox.setAttribute('aria-label', `Mark "${todo.title}" as done`);
  checkbox.addEventListener('change', () =>
    run(() => api('PATCH', `/todos/${todo.id}`, { done: checkbox.checked }))
  );

  const title = document.createElement('span');
  title.className = 'title';
  title.textContent = todo.title;

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'secondary';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => startEditing(item, title, todo));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'danger';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => run(() => api('DELETE', `/todos/${todo.id}`)));

  item.append(checkbox, title, editButton, deleteButton);
  return item;
}

// Swaps the title for a text box. Enter saves, Escape cancels.
function startEditing(item, title, todo) {
  const editor = document.createElement('input');
  editor.type = 'text';
  editor.className = 'editor';
  editor.value = todo.title;
  editor.setAttribute('aria-label', 'Edit title');

  let finished = false;
  const finish = (save) => {
    if (finished) return;
    finished = true;
    if (save && editor.value !== todo.title) {
      run(() => api('PATCH', `/todos/${todo.id}`, { title: editor.value }));
    } else {
      loadTodos();
    }
  };

  editor.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') finish(true);
    if (event.key === 'Escape') finish(false);
  });
  editor.addEventListener('blur', () => finish(true));

  item.replaceChild(editor, title);
  editor.focus();
  editor.select();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = input.value;
  run(async () => {
    await api('POST', '/todos', { title });
    input.value = '';
  });
});

loadTodos();
