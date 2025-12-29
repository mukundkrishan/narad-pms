# Narad PMS - Project Management System

A modern, full-stack project management system built with Laravel 12 and React.

## Architecture

```
narad-pms/
│
├── backend/          # Laravel 12 (API only)
├── frontend/         # React Web (Vite)
├── mobile/           # React Native (future)
├── docs/             # Documentation
└── README.md         # This file
```

## Tech Stack

### Backend (API)
- **Laravel 12** - PHP Framework
- **MySQL** - Database
- **JWT Authentication** - API Security
- **RESTful API** - Clean API Design

### Frontend (Web)
- **React 18** - UI Library
- **Vite** - Build Tool
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling

### Mobile (Future)
- **React Native** - Cross-platform mobile development

## Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL
- XAMPP (for local development)

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features (Planned)

- [ ] User Authentication & Authorization
- [ ] Project Management
- [ ] Task Management
- [ ] Team Collaboration
- [ ] File Management
- [ ] Real-time Notifications
- [ ] Dashboard & Analytics
- [ ] Mobile App (Future)

## Development

- Backend API: `http://localhost:8000`
- Frontend Web: `http://localhost:5173`

## License

This project is licensed under the MIT License.