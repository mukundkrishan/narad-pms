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
- **MySQL** - Database (narad-pms)
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
- Node.js 24.12.0+ (updated)
- MySQL
- XAMPP (for local development)

### Setup Instructions

#### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Create MySQL database 'narad-pms' first
php artisan migrate
php artisan serve
```

#### 2. Frontend Setup
```bash
cd frontend
npm install

# Fix PowerShell execution policy if needed:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

npm run dev
```

## Project Status

### Completed
- [x] Project structure created
- [x] Laravel 12.44.0 backend installed
- [x] React + TypeScript frontend setup
- [x] MySQL database configuration
- [x] Node.js updated to v24.12.0
- [x] NPM dependencies installed
- [x] PowerShell execution policy configured

### In Progress
- [ ] Database migration setup
- [ ] API routes configuration
- [ ] Frontend-backend integration

### Planned Features
- [ ] User Authentication & Authorization
- [ ] Project Management
- [ ] Task Management
- [ ] Team Collaboration
- [ ] File Management
- [ ] Real-time Notifications
- [ ] Dashboard & Analytics
- [ ] Mobile App (Future)

## Development URLs

- **Backend API**: `http://localhost:8000`
- **Frontend Web**: `http://localhost:5173`
- **Database**: `narad-pms` (MySQL)

## Troubleshooting

### PowerShell Script Execution Error
If you get "execution policies" error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node.js Version Issues
Ensure Node.js v20.19+ or v22.12+ is installed:
```bash
node --version  # Should show v24.12.0+
```

## License

This project is licensed under the MIT License.