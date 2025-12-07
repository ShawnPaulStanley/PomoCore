# PomoCore

A modern Pomodoro timer application with focus tracking, streak management, and productivity insights.

## Features

- Customizable Pomodoro timer with focus and break modes
- Real-time streak tracking
- Weekly focus statistics with interactive charts
- Task management
- Spotify integration for study playlists
- Motivational quotes
- Wellness break reminders
- Scribble board for quick notes
- Multiple theme options
- Dark mode support
- User authentication with Google sign-in
- Data persistence with Supabase

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Supabase for authentication and database
- Recharts for data visualization
- Lucide React for icons

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (for authentication and data storage)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShawnPaulStanley/PomoCore.git
   cd pomocore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables as described above

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## Database Setup

The application uses Supabase with the following tables:

### Sessions Table
```sql
create table sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  duration_minutes integer not null,
  mode text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Tasks Table
```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

Enable Row Level Security (RLS) policies for both tables to ensure users can only access their own data.

## License

MIT

## Live Demo

https://pomocore.vercel.app
