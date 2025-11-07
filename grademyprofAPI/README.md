# GradeMyProf API

Backend API service for the GradeMyProf application built with Go and Fiber framework.

## 🚀 Quick Start

### Prerequisites
- Go 1.21 or higher
- Supabase account with database set up

### Installation

1. Install dependencies:
```bash
cd grademyprofAPI
go mod download
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Run the server:
```bash
# Development (with hot reload)
air

# Production
go run main.go
```

The API will be available at `http://localhost:4000`

## 📁 Project Structure

```
grademyprofAPI/
├── main.go           # Main application entry point
├── go.mod            # Go module dependencies
├── go.sum            # Dependency checksums
├── .env              # Environment variables (not in git)
├── .air.toml         # Air hot reload configuration
└── tmp/              # Temporary build files (not in git)
```

## 🔌 API Endpoints

### Professors
- `GET /api/professors?campus={campus}` - Get all professors by campus
- `GET /api/professors/:id` - Get single professor by ID
- `GET /api/professors/:id/reviews` - Get all reviews for a professor
- `POST /api/professors/:id/reviews` - Create a new review

### User Reviews
- `GET /api/professors/:id/user-review?user_email={email}` - Check if user has reviewed professor

## 🔧 Environment Variables

Create a `.env` file with:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=4000
```

## 📊 Database Schema

See `/migrations` folder in the root directory for database schema and migrations.

## 🛠 Development

### Hot Reload
```bash
air
```

### Build
```bash
go build -o bin/api main.go
```

### Run Tests
```bash
go test ./...
```

## 📦 Dependencies

- [Fiber](https://gofiber.io/) - Web framework
- [godotenv](https://github.com/joho/godotenv) - Environment variable loading
- [Air](https://github.com/cosmtrek/air) - Hot reload tool

## 🔒 Security

- CORS enabled for frontend (localhost:5173)
- University email validation
- One review per user per professor constraint

## 📝 License

Part of the GradeMyProf project.
