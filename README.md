# Personal Productivity Dashboard 🚀

A minimalist, high-performance personal workspace designed to track daily habits, manage task progress, and intensely visualize consistency over time. Built with Next.js and securely synced via Supabase.

## ✨ Features

- **Dynamic Progress Tracking**: Customizable milestone tracker (e.g., NeetCode 150) with target adjustments and celebratory milestones.
- **Daily Focus Checklist**: Draggable drag-and-drop task reordering, completion tracking, and automatic real-time progress saving.
- **Momentum Streaks**: Tracks perfect consecutive days to heavily incentivize compounding consistency.
- **90-Day Heatmap**: GitHub-style activity graph visualizing daily productivity intensity over the last 3 months.
- **Time-Aware Greetings**: Personalized, dynamic interface greetings that adapt beautifully to the time of day.
- **Data Portability**: Full JSON export and import guarantees ownership over your local data.
- **Cloud Synchronization**: Backed by a secure Supabase PostgreSQL instance with authenticated row-level database rules.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (React App Router)
- **Styling**: Pure vanilla CSS (Glassmorphism, backdrop-blur, CSS Grid)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security)
- **Icons**: Lucide React

## 🚀 Getting Started

1. Clone the repository locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` variables with your specific Supabase Project URL and Anon Key:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   ```
4. Setup the database tables by executing the code in `supabase_setup.sql` in your Supabase SQL editor.
5. Start the local development server:
   ```bash
   npm run dev
   ```

## 🎮 Easter Eggs

Try discovering hidden interactions baked natively into the UI... (Hint: The classic arcade cheat code lives on).
