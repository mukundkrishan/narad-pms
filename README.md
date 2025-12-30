# Narad PMS - Project Management System

[![Laravel](https://img.shields.io/badge/Laravel-12.44.0-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.2+-purple.svg)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://mysql.com)

A modern, full-stack project management system built with Laravel 12 and React 18, featuring multi-tenant architecture and role-based access control.

## 🚀 Features

### Core Features
- **Multi-tenant Architecture** - Separate organizations with isolated data
- **Dual Authentication System** - Super Admin and Corporate user authentication
- **Role-based Access Control** - Super Admin, Corporate Admin, and User roles
- **Real-time Dashboard** - Dynamic statistics and analytics
- **User Management** - Complete CRUD operations for users
- **Organization Management** - Full organization lifecycle management
- **Settings System** - Configurable user and system preferences
- **Responsive Design** - Mobile-friendly interface with Font Awesome icons

### Technical Features
- **JWT Authentication** - Secure token-based authentication
- **RESTful API** - Clean API design with JSON responses
- **TypeScript Support** - Type-safe frontend development
- **Date Formatting** - Consistent DD-MM-YYYY format throughout
- **Error Handling** - Comprehensive error management
- **Security** - CORS configuration and input validation

## 🏗️ Architecture

```
narad-pms/
│
├── backend/          # Laravel 12 (API only)
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── SuperAdmin/     # Super admin controllers
│   │   │   └── Corporate/      # Corporate controllers
│   │   ├── Models/
│   │   └── Traits/
│   ├── database/
│   └── routes/
│
├── frontend/         # React 18 + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── super_admin/    # Super admin components
│   │   │   └── corporate/      # Corporate components
│   │   ├── layouts/
│   │   ├── auth/
│   │   ├── api/
│   │   └── utils/
│   └── public/
│
├── mobile/           # React Native (Future)
├── docs/             # Documentation
└── README.md         # This file
```

## 🛠️ Tech Stack

### Backend
- **Laravel 12.44.0** - PHP Framework
- **PHP 8.2+** - Server-side language
- **MySQL 8.0+** - Database
- **JWT Authentication** - API Security (tymon/jwt-auth)
- **RESTful API** - Clean API Design

### Frontend
- **React 18** - UI Library
- **TypeScript 5.x** - Type Safety
- **Vite** - Build Tool
- **CSS3** - Styling
- **Font Awesome 6.4.0** - Icons
- **React Router v6** - Client-side routing

### Development Tools
- **XAMPP 8.2** - Local development environment
- **Node.js 24.12.0+** - JavaScript runtime
- **Composer** - PHP dependency manager
- **npm** - Node package manager

## 📋 Prerequisites

- **PHP 8.2+**
- **Composer**
- **Node.js 24.12.0+**
- **MySQL 8.0+**
- **XAMPP** (for local development)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/narad-pms.git
cd narad-pms
```

### 2. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# Configure database in .env file
# DB_DATABASE=narad-pms
# DB_USERNAME=root
# DB_PASSWORD=

# Create database and run migrations
php artisan migrate --seed
php artisan serve
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Fix PowerShell execution policy if needed (Windows)
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

npm run dev
```

### 4. Access Application
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **Database**: narad-pms (MySQL)

## 🔐 Default Credentials

### Super Admin
- **Email**: super@admin.com
- **Password**: password
- **Access**: http://localhost:5173/super/login

### Corporate User (Example: NET2025)
- **Email**: aab@gmail.com
- **Password**: 123456
- **Access**: http://localhost:5173/NET2025/login

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Project Documentation](docs/PROJECT_DOCUMENTATION.md)** - Complete project overview
- **[API Reference](docs/API_REFERENCE.md)** - API endpoints and examples
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions

## 🔗 API Endpoints

### Authentication
```http
POST /api/v1/super/login              # Super admin login
POST /api/v1/{organizationCode}/login # Corporate login
```

### Dashboards
```http
GET /api/v1/super-admin/dashboard     # Super admin dashboard
GET /api/v1/corporate/dashboard       # Corporate dashboard
```

### Management
```http
GET    /api/v1/organizations          # List organizations
POST   /api/v1/organizations          # Create organization
GET    /api/v1/corporate/users        # List corporate users
POST   /api/v1/corporate/users        # Create user
```

## 🗄️ Database Schema

### Key Tables
- **users** - User accounts with role-based access
- **corporates** - Organization/company information
- **settings** - User-specific configuration settings

### User Roles
1. **Super Admin (role_id: 1)** - System administration
2. **Corporate Admin (role_id: 2)** - Organization management
3. **Corporate User (role_id: 3)** - Limited access

## 🎨 User Interface

### Super Admin Interface
- System-wide dashboard with analytics
- Organization management (CRUD)
- Cross-organization user management
- System settings and configuration
- Configurable quick actions

### Corporate Interface
- Organization-specific dashboard
- Team member management
- Roles and permissions
- Organization settings
- Responsive sidebar navigation

## 🔧 Development

### Code Structure
```
frontend/src/
├── components/
│   ├── super_admin/     # Super admin components
│   ├── corporate/       # Corporate components
│   └── common/          # Shared components
├── layouts/             # Layout components
├── auth/               # Authentication context
├── api/                # API configuration
├── utils/              # Utility functions
└── assets/             # Static assets
```

### Key Features
- **Separate API controllers** for Super Admin and Corporate
- **Role-based routing** and component access
- **Consistent date formatting** (DD-MM-YYYY)
- **Centralized API configuration**
- **TypeScript interfaces** for type safety
- **Responsive design** with Font Awesome icons

## 🚀 Deployment

### Production Requirements
- **Web Server**: Nginx/Apache
- **PHP**: 8.2+ with required extensions
- **Database**: MySQL 8.0+/MariaDB 10.6+
- **SSL Certificate**: Required for HTTPS
- **Node.js**: 18.0+ (for build process)

### Quick Deploy
```bash
# Backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan migrate --force

# Frontend
npm run build
# Deploy dist/ folder to web server
```

See [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔍 Testing

### API Testing
```bash
# Super Admin Login
curl -X POST http://localhost:8000/api/v1/super/login \
  -H "Content-Type: application/json" \
  -d '{"email":"super@admin.com","password":"password"}'

# Corporate Login
curl -X POST http://localhost:8000/api/v1/NET2025/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aab@gmail.com","password":"123456"}'
```

## 🐛 Troubleshooting

### Common Issues

#### PowerShell Execution Policy (Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### CORS Issues
Update `config/cors.php` with frontend URL:
```php
'allowed_origins' => ['http://localhost:5173'],
```

#### JWT Token Issues
```bash
php artisan jwt:secret
php artisan config:clear
```

#### Database Connection
Verify `.env` database configuration:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=narad-pms
```

## 📈 Project Status

### ✅ Completed Features
- [x] Multi-tenant architecture
- [x] Dual authentication system
- [x] Role-based access control
- [x] Super admin dashboard
- [x] Corporate dashboard
- [x] Organization management
- [x] User management
- [x] Settings system
- [x] Responsive UI with Font Awesome
- [x] JWT authentication
- [x] API documentation

### 🚧 In Development
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] File upload system
- [ ] Advanced permissions

### 📅 Planned Features
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Advanced security features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PSR-12 coding standards for PHP
- Use TypeScript for frontend development
- Write meaningful commit messages
- Add documentation for new features
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: Laravel 12 + PHP 8.2
- **Frontend Development**: React 18 + TypeScript
- **Database Design**: MySQL 8.0
- **UI/UX Design**: Responsive CSS + Font Awesome

## 📞 Support

For technical support or questions:
- Check the [Documentation](docs/)
- Review [API Reference](docs/API_REFERENCE.md)
- See [Troubleshooting Guide](docs/PROJECT_DOCUMENTATION.md#troubleshooting)

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added corporate dashboard and user management
- **v1.2.0** - Enhanced UI with Font Awesome icons
- **v1.3.0** - Improved authentication and security

---

**Built with ❤️ using Laravel 12 and React 18**

*Last Updated: December 2025*