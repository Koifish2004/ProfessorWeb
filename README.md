# GradeMyProfessor

A RateMyProfessor clone for BITS Pilani students across Pilani, Goa, and Hyderabad campuses.

## What is this?

Students can rate professors with star ratings and written reviews. Professors get an average rating based on all reviews. You need a BITS Pilani email to login and use the app.

## Requirements

To use this app, you need:

- A BITS Pilani university email (@pilani.bits-pilani.ac.in, @goa.bits-pilani.ac.in, or @hyderabad.bits-pilani.ac.in)
- Login via Google OAuth to submit or edit reviews
- You can browse professors without logging in, but functionality is limited

**This is not deployed publicly.** You need to run it locally or deploy it yourself.

## Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS, shadcn/ui  
**Backend:** Go with Fiber (main API) and Gin (auth service)  
**Database:** Supabase (PostgreSQL)  
**Authentication:** Firebase OAuth + JWT

## Local Development Setup

### Prerequisites

- Go 1.21+
- Node.js 18+
- Supabase account (free tier works)
- Firebase project (free tier works)

### Step 1: Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from project settings
3. Run migrations in order from the `/migrations` folder:
   - `001_newtables.sql`
   - `002_indexing.sql`
   - `005_reviews_table.sql`
4. Disable Row Level Security (RLS) on the reviews table, or use `SUPABASE_SERVICE_ROLE_KEY` instead

### Step 2: Authentication Setup (Firebase)

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Google Sign-In under Authentication
3. Add `localhost` to authorized domains (Authentication > Settings > Authorized domains)
4. Copy all 7 Firebase config values (API key, auth domain, project ID, etc.)

### Step 3: Install and Configure

Clone the repository:

```bash
git clone [your-repo-url]
cd GradeMyProf
```

**Auth Service Setup:**

```bash
cd grademyprofAuth
cp .env.example .env
# Edit .env and add:
# JWT_SECRET=your_random_secret_here (generate with: openssl rand -base64 32)
go mod download
```

**API Service Setup:**

```bash
cd grademyprofAPI
cp .env.example .env
# Edit .env and add:
# SUPABASE_URL=https://xxx.supabase.co
# SUPABASE_ANON_KEY=eyJ...
# PORT=4000
go mod download
```

**Frontend Setup:**

```bash
cd grademyprofUI
cp .env.example .env
# Edit .env and add all 7 Firebase variables:
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# VITE_FIREBASE_PROJECT_ID=...
# (and 4 more)
npm install
```

### Step 4: Run All Services

You need all three services running simultaneously:

```bash
# Terminal 1 - Auth Service
cd grademyprofAuth
go run main.go  # Runs on :8080

# Terminal 2 - API Service
cd grademyprofAPI
go run main.go  # Runs on :4000

# Terminal 3 - Frontend
cd grademyprofUI
npm run dev  # Runs on :5173
```

Open `http://localhost:5173` in your browser.

### Common Setup Issues

**CORS errors:** Make sure your API is configured to allow `http://localhost:5173` (no trailing slash)

**Auth not working:** Verify `localhost` is in Firebase authorized domains and all 7 Firebase env variables are set correctly

**Database errors:** Check that Supabase migrations ran successfully and RLS is disabled on reviews table

**Services can't communicate:** All three services must be running on their default ports (8080, 4000, 5173)

## What Works

- Google OAuth login with BITS email validation
- Browse professors by campus (Pilani, Goa, Hyderabad)
- Search professors by name/department
- Submit reviews with 1-5 star ratings and comments
- Edit your own reviews
- View professor average ratings
- Duplicate review prevention (one review per user per professor)
- Rate limiting on auth and API endpoints

## Known Limitations

- No ability to delete reviews (only create/edit)
- No Dubai or Mumbai campus support yet
- No sorting or filtering on reviews
- No pagination (loads all reviews at once)
- No user profile page to see all your reviews
- No review voting or moderation system

## Project Structure

```
GradeMyProf/
├── grademyprofUI/          # React frontend
├── grademyprofAPI/         # Go Fiber API service
├── grademyprofAuth/        # Go Gin auth service
├── migrations/             # Supabase SQL migrations
└── README.md
```

## API Endpoints

- `GET /api/professors?campus={campus}` - List professors by campus
- `GET /api/professors/:id` - Get professor details
- `GET /api/professors/:id/reviews` - Get all reviews for a professor
- `POST /api/professors/:id/reviews` - Submit a new review
- `PUT /api/professors/:id/reviews/:review_id` - Edit your review
- `GET /api/professors/:id/user-review?user_email={email}` - Check if user has reviewed

## License

MIT

## Author

Kaif Khan (@Koifish2004)
