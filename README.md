# GradeMyProf

A comprehensive professor rating system for BITS Pilani (all campuses) with Google OAuth authentication restricted to university emails.

## 🏗 Project Structure

```
GradeMyProf/
├── grademyprofUI/          # Frontend (React + Vite + TailwindCSS)
├── grademyprofAPI/         # Backend API (Go + Fiber)
├── migrations/             # Database migrations (Supabase/PostgreSQL)
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Backend API Setup

```bash
cd grademyprofAPI
go mod download
cp .env.example .env  # Configure your Supabase credentials
air  # Start with hot reload
```

Backend runs on `http://localhost:4000`

See [grademyprofAPI/README.md](grademyprofAPI/README.md) for more details.

### 2. Frontend UI Setup

```bash
cd grademyprofUI
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

See [grademyprofUI/README.md](grademyprofUI/README.md) for more details.

### 3. Database Setup

1. Create a Supabase project
2. Run migrations in order from `/migrations` folder
3. Configure RLS policies as specified in migration files

## ✨ Features

- 🔐 **Google OAuth Authentication** - Restricted to BITS university emails
- 🎓 **Multi-Campus Support** - Pilani, Goa, and Hyderabad campuses
- ⭐ **Review System** - Rate professors with star ratings and comments
- 🚫 **Duplicate Prevention** - One review per user per professor
- 📊 **Real-time Statistics** - Auto-updated professor ratings
- 🎨 **Modern UI** - Dark theme with responsive design
- 🔍 **Search & Filter** - Find professors quickly

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **shadcn/ui** component library
- **Firebase** for authentication

### Backend
- **Go 1.21+** with Fiber framework
- **Supabase** (PostgreSQL) for database
- **Air** for hot reload in development

## 🔧 Development

### Prerequisites
- Node.js 18+ and npm
- Go 1.21+
- Supabase account
- Firebase project (for Google OAuth)

### Environment Variables

**Backend** (`.env` in `grademyprofAPI/`):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
PORT=4000
```

**Frontend** (`.env` in `grademyprofUI/`):
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

## 📋 API Endpoints

- `GET /api/professors?campus={campus}` - Get professors by campus
- `GET /api/professors/:id` - Get professor details
- `GET /api/professors/:id/reviews` - Get professor reviews
- `POST /api/professors/:id/reviews` - Submit a review
- `GET /api/professors/:id/user-review?user_email={email}` - Check user review status

## 🗄 Database Schema

See `/migrations` folder for complete schema including:
- `professor` table - Professor information and statistics
- `reviews` table - Student reviews with ratings
- Unique constraints and indexes
- Row Level Security policies

## 🎨 UI Components

- Professor cards with ratings
- Interactive review forms
- Star rating system
- Campus selection buttons
- Search and filter functionality
- Review display cards

## 🔒 Security Features

- University email validation
- One review per user per professor (database constraint)
- CORS configuration
- Row Level Security (RLS) on Supabase
- Firebase authentication

## 🚧 Future Microservices

The project structure is designed to support additional microservices:
- `grademyprofAuth/` - Dedicated authentication service
- `grademyprofAnalytics/` - Analytics and reporting
- `grademyprofNotifications/` - Email/push notifications
- And more...

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Kaif Khan (@Koifish2004)

## 🙏 Acknowledgments

- BITS Pilani for the educational context
- shadcn/ui for beautiful components
- Supabase for backend infrastructure
