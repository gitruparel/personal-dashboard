# Project Context: Developer's Personal Dashboard

A consistency-first productivity system designed to enforce momentum and execution for developers.

---

## 🧠 Philosophy & Goals
- **Core Mantra**: "Consistency beats intensity."
- **Primary Goal**: Prevent inconsistency in learning and building by tracking **momentum** rather than just tasks.
- **Inspiration**: Duolingo (streak psychology) and GitHub (activity visualization).

## 🛠 Tech Stack
- **Frontend**: Next.js (App Router, TypeScript).
- **Database & Auth**: Supabase (Postgres with Row Level Security).
- **Styling**: **STRICT Vanilla CSS** (No UI frameworks like Tailwind/Bootstrap).
- **Icons**: Lucide React.
- **Animations**: `canvas-confetti`.

---

## 📂 Project Structure
- `app/`: Next.js pages and global styles (`globals.css`).
- `components/`: React components (UI building blocks).
- `lib/`: Supabase client initialization.
- `utils/`: Helper functions (e.g., dynamic greetings).
- `supabase_setup.sql`: Database schema and RLS policies.
- `public/`: Static assets and PWA manifest.

---

## 📊 Data Models (Supabase)
1. **`profiles`**: User stats and preferences.
    - `id`: UUID (auth.users primary key).
    - `streak`: Current momentum count (derived/stored).
    - `neetcode_progress`: Problems solved.
    - `last_completed_date`: Format `YYYY-MM-DD`.
    - `last_reset_date`: Tracked to handle daily task resets.
2. **`tasks`**: Daily todo items.
    - `user_id`: UUID.
    - `text`: Task description.
    - `completed`: Boolean.
3. **`daily_activity`**: 90-day history.
    - `date`: `YYYY-MM-DD`.
    - `activity_level`: Integer (increments on task completion/progress).

---

## ⚙️ Core Systems & Logic

### 1. 🔥 Streak Calculation
- Streaks are calculated dynamically in `Dashboard.tsx` from the `daily_activity` records.
- It counts backwards from today (or yesterday) as long as consecutive dates have `activity_level > 0`.

### 2. 🔄 Daily Reset Logic
- Tasks are reset to `completed: false` when a user logs in on a new calendar day (`last_reset_date !== today`).
- Activity is logged automatically whenever a task is checked or progress is added.

### 3. 📊 Activity Graph (Heatmap)
- Displays a 90-day GitHub-style heatmap.
- Data is fetched from `daily_activity` and rendered with color intensity based on `activity_level`.

---

## 🤖 AI Agent Interaction Guidelines

### 1. Communication Style
- Be concise and technical.
- Use GitHub-flavored markdown for all responses.
- Always provide a clear summary of changes.

### 2. Development Constraints
- **Styling**: Never install or use Tailwind CSS. Stick to Vanilla CSS in `globals.css` or scoped CSS if necessary.
- **Icons**: Use only `lucide-react`.
- **State**: Prefer Supabase hooks and real-time channels for synchronization across devices.
- **Preservation**: Keep existing comments and complex logic (like the syncing refs) unless explicitly asked to refactor.

### 3. File Editing Protocol
- Verify TypeScript types before saving.
- Ensure RLS policies are considered when adding new tables.
- **STRICT**: After editing files, include a copy-pastable Git commit command.

### 4. Git Commitment Pattern
After any major change, include a command using the **Conventional Commits** format:
- `feat`: (new feature)
- `fix`: (bug fix)
- `docs`: (documentation changes)
- `style`: (formatting, missing semi colons, etc; no code change)
- `refactor`: (refactoring production code)
- `perf`: (performance improvements)
- `chore`: (updating grunt tasks etc; no production code change)

**Example Format**:
`git add . && git commit -m "feat: implement persistent theme state"`

---

## 🚀 Development Setup
- **Env Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Commands**: `npm run dev` (development), `npm run build` (production).
