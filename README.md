# Developer's Personal Dashboard 🚀

A high-performance, ultra-premium personal productivity workspace engineered explicitly for software developers. Designed to track recurring engineering habits, manage DSA grinding milestones, and intensely visualize long-term consistency. Built natively with Next.js, and strictly synchronized via Supabase PostgreSQL.

## 💻 Built for Engineers
This workspace strips away the unnecessary clutter of traditional to-do apps to focus purely on what a computer engineer actually needs:
- **DSA Milestone Tracking**: Natively features a customizable target progress tracker specifically designed for grinding algorithms (such as tracking the NeetCode 150). 
- **AMOLED Battery Optimization**: The UI is built on a pure `#050505` black foundation. Because black pixels are completely physically turned off on OLED/AMOLED smartphone screens, you can safely leave this Progressive Web App (PWA) open continuously on your phone without drastically draining your battery. Keep your tasks locked in right in front of you all day.
- **Developer-Centric Heatmap**: A pristine 90-day GitHub-style Activity Graph seamlessly visualizes your daily productivity intensity over the last 3 months, leveraging that familiar "commit history" psychological drive.

## ✨ Technical Features

- **Deep Mobile PWA Integration**: Authentic native touch-feel on iOS. Includes custom hardware-accelerated spring animations (`cubic-bezier` physics), removed ghost-hovers for true tactile pressing, and a flawless locked viewport with a frictionless scrolling heat-map.
- **Luxury UI Aesthetics**: 
  - **Glass Sheen Lighting**: Multi-layered `linear-gradient` backgrounds simulating ambient light catching the beveled edges of frosted glass.
  - **Spring Physics**: Bouncy, organic, physical reactions mapping to all drag-and-drop and touch interactions.
  - **Organic Depth Textures**: A 4% fractional SVG noise layer injected across the entire viewport to permanently kill the "flat digital HTML" look.
- **Data Portability**: Full JSON state export and import architecture guarantees uncompromised ownership over your local data.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (React App Router)
- **Styling**: Vanilla Object-Oriented CSS (Zero utility-class bloat, 100% custom variables and physics)
- **Database & Auth**: Supabase (PostgreSQL, Strictly Locked Row Level Security)
- **Iconography**: Lucide React + Generative AI PWA Asset Injection

## 🚀 Getting Started

1. Clone the repository locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` variables with your specific Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   ```
4. Setup the database backbone structure by executing the provided `supabase_setup.sql` internally within your Supabase SQL editor.
5. Boot the matrix:
   ```bash
   npm run dev
   ```

## 🎮 Easter Eggs

Hidden interactions are baked deep into the DOM structure... (Hint: The legendary classic arcade cheat code lives on).
