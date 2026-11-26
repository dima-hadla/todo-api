# Todo API: Take-Home Assignment

Thanks for applying to the Johnston's Grain software development apprenticeship! This assignment has two parts:

1. **Build** the back end of a small todo app with Node.js and Express.
2. **Review** some code an AI assistant wrote for the same app, then find and fix its bugs.

The web page is already built for you. When you start the app you'll see a todo list in your browser. Showing the list works already, but adding, editing, checking off and deleting todos don't work yet. Making them work is Part 1.

## Before you start

- **Time:** aim for about **3–4 hours**, and please don't spend more than 4. If you use AI tools it will probably take less. Spend any spare time making sure you understand your code, not on extras. Unfinished work is fine. Tell us in your notes what you'd do next.
- **Deadline:** one week after you received this (the exact date is in our email).
- **Questions:** if something is unclear, reply to the email we sent you this assignment in. Asking questions is a good thing, not a bad one.

## Using AI

**Using AI is encouraged.** Use ChatGPT, Claude, Copilot or any other tool, the same way you would on the job. Our developers use these tools every day, and reviewing and testing the code they produce is a big part of this role.

**The only rule: you must understand everything you submit.** In the interview you'll be asked to:

- explain any line of your `src/todos.js` without AI help,
- predict what a request will return before we send it,
- make a small change to your code live. You may use AI for this, but you'll explain what it suggests before you accept it.

Some tips:

- Ask the AI to explain its code, not just to write it.
- Test everything it gives you. AI tools make confident mistakes, and Part 2 is full of them.
- Keep track of what the AI got wrong or what you changed. You'll need it for your notes.

**Not using AI is completely fine too.** It won't count against you. If you'd like a free AI tool: GitHub Copilot is free for verified students through [GitHub Education](https://education.github.com/), and ChatGPT, Claude and Gemini all have free plans.

## Setup

1. Install **Node.js 20 or newer**. The "LTS" version from [nodejs.org](https://nodejs.org) is the right one. Check it worked by running `node --version` in a terminal.
2. Unzip the project somewhere easy to find, like your Documents folder. If you'd like to use Git, run `git init` in the project folder and commit as you go. That's optional, but a plus.
3. Open a terminal in the project folder and install the dependencies:

   ```bash
   npm install
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

   `npm run dev` restarts the server every time you save a file. (`npm start` runs it without restarting.) Keep an eye on this terminal: errors from the server show up here.

5. Open <http://localhost:3000> in your browser. You should see two todos. If you try to add one you'll see a red "not implemented yet" message. That's expected!

## What's in the project

```
public/            The web page (HTML, CSS, browser JavaScript). Already done.
src/server.js      Starts the server on port 3000.
src/app.js         Sets up Express: JSON bodies, the web page, the /todos routes, errors.
src/todos.js       The /todos routes. ← Both parts of the assignment happen in this file.
test/              A sample automated test. Run it with `npm test`.
```

You can change any file you like, but you shouldn't need to change the files in `public/`.

## Part 1: Build the API

Todos are stored in memory, in the `todos` array in `src/todos.js`. That means they reset every time the server restarts, and that's fine. A todo looks like this:

```json
{ "id": 1, "title": "Read the README", "done": true }
```

When a request has a problem, respond with a fitting status code and a JSON body in this shape:

```json
{ "error": "A short message explaining what went wrong" }
```

`GET /todos` is already done as an example. Implement these three:

| Request | When it works | When it doesn't |
| --- | --- | --- |
| `POST /todos` | `201` + the new todo | `400` if the title is bad |
| `PATCH /todos/:id` | `200` + the updated todo | `404` if the todo doesn't exist, `400` if the body is bad |
| `DELETE /todos/:id` | `204` (no body) | `404` if the todo doesn't exist |

### 1. Create a todo: `POST /todos`

The request body looks like `{ "title": "Buy milk" }`.

- Give the new todo a new, unique `id` and set `done` to `false`.
- Remove extra spaces from the start and end of the title.
- Respond with `201` and the new todo.
- Respond with `400` if `title` is missing, isn't a string, or is empty (or only spaces).

### 2. Update a todo: `PATCH /todos/:id`

The request body can contain `title`, `done`, or both, for example `{ "done": true }` or `{ "title": "Buy oat milk" }`.

- Only change the fields that were sent.
- Respond with `200` and the updated todo.
- Respond with `404` if there's no todo with that id.
- Respond with `400` if `title` is sent but is empty or not a string, or if `done` is sent but isn't `true` or `false`.
- What should happen if the body has neither `title` nor `done`? You decide, and explain your choice in your notes.

> **Hint:** `req.params.id` is always a string (like `"2"`), but the ids in the array are numbers.

### 3. Delete a todo: `DELETE /todos/:id`

- Remove the todo and respond with `204` and no body.
- Respond with `404` if there's no todo with that id.

## Part 2: Review the AI's code

At the bottom of `src/todos.js` there are two routes an AI assistant wrote for us. This is what they're **supposed** to do:

| Request | Should respond with |
| --- | --- |
| `GET /todos/:id` | `200` + that todo, or `404` + an error body if there's no todo with that id |
| `GET /todos/stats` | `200` + `{ "total": 2, "done": 1, "percentDone": 50 }`, where `percentDone` is a whole number from 0 to 100 |

The code looks reasonable, but it has **at least three bugs**. Your job:

1. Find the bugs. Try the endpoints in your browser or with curl, try unusual situations, and watch the server terminal for errors.
2. Fix each one, and make the smallest change that fixes it.
3. In your notes, describe each bug: what was wrong, how you found it, and how you fixed it.

You can ask an AI to review the code too. Be careful, though: AI reviewers often miss real bugs and "fix" things that weren't broken. Test every fix yourself before you trust it.

## Testing your work

- **The web page:** the easiest way to test Part 1. Errors from your API show up in red.
- **The browser address bar:** works for any `GET` request, like <http://localhost:3000/todos/1> or <http://localhost:3000/todos/stats>.
- **curl:** on Windows, run these in **Git Bash** (PowerShell handles the quotes differently):

  ```bash
  curl http://localhost:3000/todos
  curl http://localhost:3000/todos/stats
  curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
  curl -X PATCH http://localhost:3000/todos/1 -H "Content-Type: application/json" -d '{"done":false}'
  curl -X DELETE http://localhost:3000/todos/1 -i
  ```

- **A REST client:** [Postman](https://www.postman.com/), or the Thunder Client or REST Client extensions for VS Code, if you prefer clicking to typing.
- **Automated tests:** `npm test` runs the tests in `test/`. There's one example. Writing more is optional (see below).

## Optional extras

Only try these once both parts are done. Extras don't make up for missing required work. We'd rather see the required parts done carefully.

- Write tests that would have caught the Part 2 bugs.
- Save the todos to a JSON file so they survive a server restart.
- Support `GET /todos?done=true` and `GET /todos?done=false` to filter the list.
- Improve the web page.

## Your notes

Before you submit, fill in the **Notes** section at the bottom of this file. Short answers are fine. Honest answers matter more than impressive ones.

## Submitting

Either:

- Push the project to a **public GitHub** repository and reply with the link. Small commits as you go are a plus. (If you'd rather keep it private, ask us and we'll send you a GitHub username to share it with.) Or:
- Make a **zip** of the project folder, upload it to **Google Drive or OneDrive**, and reply with a share link. Please **delete the `node_modules` folder first**, because it's huge and we'll run `npm install` ourselves.

Please don't attach the zip to the email directly. Many email services, including Gmail, block zip files that contain code.

## What happens next

We'll book a 30–45 minute call with you. You'll run the app, walk us through your code and your Part 2 fixes, and make a small change together with us (see [Using AI](#using-ai) for what to expect). Googling during the call is fine. This isn't a trick. We want to see how you think and work.

## What we look for

- The app runs when we follow your instructions.
- Code that's easy to read, with clear names.
- Bad requests get sensible error responses instead of crashing the server.
- You catch and fix mistakes, whether they're yours or an AI's.
- You understand and can explain everything you submitted.
- Honest notes about what works, what doesn't and how you used AI.

We **don't** expect a fancy design, advanced patterns or every extra.

Good luck, and have fun with it!

---

## Notes

### How far I got

_What works? What doesn't?_
I completed both parts of the assignment.

- Implemented POST /todos to create new todos.
- Implemented PATCH /todos/:id to update todos.
- Implemented DELETE /todos/:id to delete todos.
- Reviewed and fixed the bugs in GET /todos/:id and GET /todos/stats.
- Tested adding, editing, completing, and deleting todos through the web page.
- Tested GET /todos, GET /todos/:id, and GET /todos/stats directly in the browser.
- Added automated tests for the API endpoints.

All 13 automated tests passed successfully.

### My decision: `PATCH` with no `title` or `done`

_What does your API do, and why?_
I decided to return a 400 Bad Request response when the request body contains neither title nor done.

I chose this behavior because an update request should include at least one field to update. If neither field is provided, there is nothing to change. Returning an error makes the API behavior clear.

### Part 2: bugs I found

| Bug | How I found it | How I fixed it |
|---|---|---|
| The todo ID was compared as a number with a string from the URL. | Reviewed and tested the GET /todos/:id endpoint. | Converted req.params.id to a number using Number(). |
| The code continued executing after sending a 404 response. | Reviewed the missing-todo response and found that execution continued after the response. | Added return before the 404 response. |
| The statistics calculation did not handle an empty todo list. | Tested the stats endpoint with an empty list. | Added a condition to return 0 when there are no todos. |
| The /stats route was placed after the /:id route. | Reviewed the route order and tested the stats endpoint. | Moved /stats before /:id. |

### How I used AI

_Which tools did you use, and for what? What did they get wrong? What did you change or reject? Write "None" if you didn't use any._
I used ChatGPT to understand the assignment, review the existing code, identify potential bugs, implement the required API endpoints, and write automated tests.

I asked for explanations of the code and the purpose of each change. I also used ChatGPT to understand test failures and correct them.

I reviewed the suggested changes and tested the application manually and with automated tests instead of relying only on AI suggestions.

All 13 automated tests passed successfully.

### What I'd improve with more time
With more time, I would:

- Add more automated tests for unusual and invalid requests.
- Improve error handling and input validation.
- Save todos to a JSON file so they remain available after restarting the server.
- Add filtering for completed and incomplete todos.
- Improve the frontend design to make the application more attractive, user-friendly, and easier to navigate.

### What I got stuck on
I initially had difficulties understanding how the tests interacted with the in-memory todo array.

Some tests affected the data used by later tests, especially when checking the empty todo list. I fixed this by deleting the remaining todos before checking the empty-list statistics.

I also encountered a syntax error while writing the expected test results, which I corrected before running the tests successfully.

### Time spent

_Roughly how many hours?_
Approximately 4.5 hours.
sS