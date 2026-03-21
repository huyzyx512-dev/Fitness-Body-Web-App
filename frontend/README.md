# Fitness App Frontend

Frontend application built with React + Vite + Tailwind CSS for the Fitness & Weight Management web app.

## Features

- 🔐 Authentication (Login, Register, Logout)
- 💪 Workout Management (Create, View, Start, Complete workouts)
- 🏋️ Exercise Library (Browse, Create, Edit, Delete exercises)
- 👤 User Profile
- 📱 Responsive Design (Mobile-first)

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Context API** - State management

## Project Structure

```
src/
├── assets/            # Images, icons
├── components/
│   ├── common/        # Button, Input, Modal, Loader
│   └── layout/        # Navbar, Footer
├── pages/
│   ├── auth/          # Login, Register
│   ├── dashboard/     # Workouts, Exercises, Profile
│   └── not-found/     # 404 page
├── services/
│   ├── api/           # Axios instance with interceptors
│   └── modules/       # API service modules (auth, user, exercises, workouts)
├── hooks/             # Custom React hooks
├── utils/             # Helper functions, formatters
├── routes/            # React Router configuration
├── context/           # AuthContext for authentication state
└── App.jsx            # Main app component
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api` by default.

### Authentication Flow

1. User logs in → receives `accessToken` → stored in localStorage
2. Access token expires (15 minutes) → automatically refreshed using refresh token (cookie)
3. Refresh token expires → user redirected to login

### Protected Routes

- `/workouts` - Requires authentication
- `/profile` - Requires authentication
- `/exercises` - Public (but create/edit/delete requires auth)

## Key Components

### Common Components
- **Button** - Reusable button with variants (primary, secondary, danger, success, outline)
- **Input** - Form input with label and error handling
- **Modal** - Reusable modal dialog
- **Loader** - Loading spinner

### Pages
- **Login/Register** - Authentication pages
- **Workouts** - Manage workout sessions (create, start, complete)
- **Exercises** - Browse and manage exercise library
- **Profile** - View user profile information

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:5000/api)

## Notes

- All API calls use axios with automatic token refresh
- Cookies are used for refresh tokens (httpOnly, secure)
- Access tokens are stored in localStorage
- Protected routes automatically redirect to login if not authenticated
