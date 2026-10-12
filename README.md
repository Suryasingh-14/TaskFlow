# TaskFlow

A task management app: Kanban board, task list, calendar, dashboard and activity timeline.
Stack: HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, MySQL.

## Build order
1. Frontend prototype (in-memory data) - `client/`
2. Node.js basics
3. Express REST API - `server/`
4. MySQL integration - `database/schema.sql`
5. Connect frontend to API
6. Polish, testing, screenshots

## Setup (once the backend exists)
1. Install Node.js 18+ and MySQL 8.
2. Run `database/schema.sql` in MySQL.
3. `cd server && cp .env.example .env` and fill in your MySQL details.
4. `npm install`, then `npm run dev`.
5. Open http://localhost:3000

## API
See the TRD, section 5. Document each endpoint here as you build it.
