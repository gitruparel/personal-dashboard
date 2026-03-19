# Developer's Personal Dashboard 🚀

I built this personal dashboard to fix one specific problem: **inconsistency in learning.** 

This isn’t just another to-do list tracker. It’s an engineered system designed strictly to force consistency for computer engineers. 

I needed a system that natively:
- **Tracks my daily streak** and visually reinforces momentum
- **Enforces the "2 lectures → build project" mindset**
- **Tracks Data Structures & Algorithms milestones** (like the NeetCode 150)
- **Shows activity density** via a 90-day GitHub-style Heatmap
- **Gives tactile, instant milestone feedback** (inspired by Duolingo)

Built originally using raw HTML, CSS, and JS, this repository represents the **full production-ready migration** utilizing Next.js and Supabase for absolute reliability.

---

## 💻 Built Specifically for Engineers
This workspace strips away the unnecessary clutter of traditional productivity apps to focus purely on what a developer actually needs:
- **DSA Milestone Tracking**: Natively features a customizable target progress tracker specifically designed for grinding algorithms. 
- **AMOLED Battery Optimization**: The UI is built on a pure `#050505` true-black foundation. Because black pixels are completely physically turned off on OLED smartphone screens, you can safely leave this Progressive Web App (PWA) open continuously on your phone without draining your battery. Keep your tasks locked in right in front of you all day.
- **Developer-Centric Heatmap**: A pristine 90-day GitHub-style Activity Graph seamlessly visualizes your daily productivity intensity over the last 3 months, leveraging that familiar "commit history" psychological drive.

## ✨ Technical Excellence

- **Deep Mobile PWA Integration**: Authentic native touch-feel on iOS. Includes custom hardware-accelerated spring animations (`cubic-bezier` physics), removed ghost-hovers for true tactile pressing, and a flawless locked viewport with frictionless touch scrolling.
- **Luxury UI Aesthetics**: 
  - **Glass Sheen Lighting**: Multi-layered `linear-gradient` backgrounds simulate ambient light catching the beveled edges of frosted glass.
  - **Spring Physics**: Bouncy, organic, physical reactions mapping to all touch interactions.
  - **Organic Depth Textures**: A 4% fractional SVG noise layer injected across the entire viewport to permanently kill the "flat digital HTML" look.
- **Data Portability**: Full JSON state export and import architecture guarantees uncompromised ownership over your local data.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (React App Router)
- **Styling**: Vanilla Object-Oriented CSS (Zero utility-class bloat, 100% custom variables and physics)
- **Database & Auth**: Supabase PostgreSQL (Strictly Locked Row Level Security)
- **Iconography**: Lucide React + Generative AI PWA Asset Injection

## 🚀 Roadmap & Future Improvements
Still aggressively improving the ecosystem:
- [x] Initial migration to Next.js + Supabase
- [x] True cloud sync via PostgreSQL
- [ ] Multi-user support with public profiles
- [ ] Granular "lecture → project" correlation tracking

## ⚙️ Getting Started

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

*Would absolutely love feedback or pull requests.*
