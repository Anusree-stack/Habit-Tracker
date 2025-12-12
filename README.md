# Habit Tracker MVP

A beautiful, calming habit-tracking web application built with Next.js, TypeScript, Prisma, and SQLite.

## Features

- ✨ **Create & Track Habits**: Choose from presets or create custom habits (measurable or yes/no)
- 📊 **Daily Logging**: Log progress for today with automatic aggregation for multiple entries
- 🔥 **Streaks**: Track consecutive days of completion
- 📅 **Calendar View**: Visualize your progress over the last 30 days
- 📈 **Analytics**: View completion rates, totals, and averages for each habit
- 🎯 **Smart Restrictions**: 
  - No backfilling - only log for today
  - 24-hour edit window for logs
  - One aggregated log per habit per day

## Tech Stack

- **Frontend**: Next.js 16 with React & TypeScript
- **Styling**: Tailwind CSS v4 with custom soft color palette
- **Backend**: Next.js API routes
- **Database**: SQLite with Prisma ORM
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd habit-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize the database** (already done, but if you need to reset):
   ```bash
   npx prisma migrate reset
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
habit-tracker/
├── app/
│   ├── api/              # API routes
│   │   ├── habits/       # Habit CRUD endpoints
│   │   ├── logs/         # Log CRUD endpoints
│   │   └── analytics/    # Analytics endpoints
│   ├── habit/[id]/       # Habit detail page
│   ├── analytics/        # Analytics overview page
│   ├── page.tsx          # Main dashboard
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles with custom theme
├── components/           # React components
│   ├── HabitCard.tsx     # Habit card with logging
│   ├── Calendar.tsx      # 30-day calendar view
│   └── AddHabitModal.tsx # Modal for adding habits
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── types.ts          # TypeScript types & preset habits
│   └── utils.ts          # Utility functions (dates, streaks)
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── dev.db            # SQLite database
└── README.md
```

## Key Implementation Details

### 24-Hour Edit Restriction

Logs can only be edited or deleted within 24 hours of creation. This is enforced in:
- `/lib/utils.ts` - `canEditLog()` function
- API routes check this before allowing updates/deletes

### Daily Aggregation

Multiple logs for the same habit on the same day are aggregated:
- For measurable habits: values are summed
- For boolean habits: latest value is kept
- Implemented via Prisma's `upsert` logic in `/api/logs/route.ts`

### No Backfilling

Users can only create logs for today's date:
- Enforced in `POST /api/logs` endpoint
- Frontend only shows today's logging interface

### Streak Calculation

Streaks are calculated on-the-fly:
- Counts consecutive days from today backwards
- Allows for "grace day" (if today not logged yet, starts from yesterday)
- Implementation in `/lib/utils.ts` - `calculateStreak()`

### Global Streak

Represents "days with at least one habit completed" - more encouraging for MVP users.

## Database Schema

### User
- Single default user for MVP (no auth)

### Habit
- `id`, `name`, `type` (MEASURABLE | BOOLEAN)
- `unit` (for measurable habits)
- `userId` (foreign key)

### HabitLog
- `id`, `habitId`, `date` (YYYY-MM-DD)
- `numericValue` (for measurable)
- `booleanValue` (for boolean)
- `createdAt`, `updatedAt`
- Unique constraint on `(habitId, date)`

## Future Enhancements (Phase 2)

- Weekly/custom frequency habits
- Reminders & notifications
- Social features (sharing streaks)
- Advanced analytics & comparisons
- User authentication
- Mobile app

## Design Philosophy

The UI uses a soft, calming color palette:
- **Primary**: Soft teal/mint (#4fd1c5)
- **Secondary**: Warm coral/peach (#fc8181)
- **Success**: Gentle green (#68d391)
- **Background**: Light off-white (#fafbfc)

Encouraging microcopy throughout:
- "One small step is still progress."
- "You showed up today. That counts."

## License

MIT
