# Narad PMS - Project Management System

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Installation & Setup](#installation--setup)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Authentication System](#authentication-system)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Features](#features)
10. [Development Guidelines](#development-guidelines)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

## Project Overview

Narad PMS is a modern, full-stack project management system designed for multi-tenant organizations. It provides separate interfaces for super administrators and corporate users with role-based access control.

### Key Features
- Multi-tenant architecture
- Dual authentication system (Super Admin & Corporate)
- Role-based access control (RBAC)
- Real-time dashboard analytics
- User management system
- Organization management
- Settings configuration
- Responsive design

## Architecture

```
narad-pms/
├── backend/          # Laravel 12 API
├── frontend/         # React 18 + TypeScript
├── mobile/           # React Native (Future)
├── docs/             # Documentation
└── README.md
```

### System Architecture
- **Frontend**: React SPA with TypeScript
- **Backend**: Laravel API-only application
- **Database**: MySQL with multi-tenant support
- **Authentication**: JWT-based authentication
- **API**: RESTful API design

## Technology Stack

### Backend
- **Framework**: Laravel 12.44.0
- **Language**: PHP 8.2+
- **Database**: MySQL 8.0+
- **Authentication**: JWT (tymon/jwt-auth)
- **API**: RESTful with JSON responses

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 + Font Awesome 6.4.0
- **HTTP Client**: Fetch API
- **Routing**: React Router v6

### Development Tools
- **Server**: XAMPP 8.2
- **Node.js**: v24.12.0+
- **Package Manager**: npm
- **Version Control**: Git

## Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 24.12.0+
- MySQL 8.0+
- XAMPP (for local development)

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# Configure database in .env
DB_DATABASE=narad-pms
DB_USERNAME=root
DB_PASSWORD=

# Run migrations
php artisan migrate --seed
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
```sql
CREATE DATABASE `narad-pms` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Super Admin Login
```http
POST /super/login
Content-Type: application/json

{
  "email": "super@admin.com",
  "password": "password"
}
```

#### Corporate Login
```http
POST /{organizationCode}/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "123456"
}
```

### Dashboard Endpoints

#### Super Admin Dashboard
```http
GET /super-admin/dashboard
Authorization: Bearer {token}
```

#### Corporate Dashboard
```http
GET /corporate/dashboard
Authorization: Bearer {token}
```

### Organization Management
```http
GET    /organizations           # List organizations
POST   /organizations           # Create organization
GET    /organizations/{id}      # Get organization
PUT    /organizations/{id}      # Update organization
DELETE /organizations/{id}      # Delete organization
```

### User Management
```http
GET    /corporate/users         # List corporate users
POST   /corporate/users         # Create user
PUT    /corporate/users/{id}    # Update user
DELETE /corporate/users/{id}    # Delete user
```

## Database Schema

### Core Tables

#### users
```sql
- id (Primary Key)
- first_name
- last_name
- name (computed)
- email (unique)
- mobile
- address
- password
- corporate_id (Foreign Key)
- role_id (1=Super Admin, 2=Admin, 3=User)
- status (active/inactive)
- created_at, updated_at
```

#### corporates
```sql
- id (Primary Key)
- name
- slug
- organization_code (unique)
- email
- phone
- address
- user_allowed
- valid_from
- valid_to
- logo
- settings (JSON)
- is_active
- status (active/inactive)
- last_payment_date
- last_payment_amount
- created_at, updated_at, deleted_at
```

#### settings
```sql
- id (Primary Key)
- user_id (Foreign Key)
- key
- value (JSON)
- type (string/json/boolean/number)
- created_at, updated_at
```

## Authentication System

### Dual Authentication
1. **Super Admin Authentication**
   - Route: `/super/login`
   - Access: System-wide administration
   - Token: `super_token`

2. **Corporate Authentication**
   - Route: `/{organizationCode}/login`
   - Access: Organization-specific features
   - Token: `token`

### JWT Configuration
```php
// config/jwt.php
'ttl' => 60, // Token lifetime in minutes
'refresh_ttl' => 20160, // Refresh token lifetime
'algo' => 'HS256',
```

## User Roles & Permissions

### Role Hierarchy
1. **Super Admin (role_id: 1)**
   - System administration
   - Organization management
   - User management across all organizations
   - System settings

2. **Corporate Admin (role_id: 2)**
   - Organization dashboard
   - User management within organization
   - Organization settings
   - Cannot be deleted

3. **Corporate User (role_id: 3)**
   - Limited dashboard access
   - Profile management
   - Basic features

### Permission Matrix
| Feature | Super Admin | Corporate Admin | Corporate User |
|---------|-------------|-----------------|----------------|
| System Dashboard | ✅ | ❌ | ❌ |
| Organizations CRUD | ✅ | ❌ | ❌ |
| Corporate Dashboard | ❌ | ✅ | ✅ |
| User Management | ✅ | ✅ (Own Org) | ❌ |
| Settings | ✅ | ✅ (Own Org) | ✅ (Personal) |

## Features

### Super Admin Features
- **Dashboard**: System-wide statistics and analytics
- **Organizations**: Complete CRUD operations
- **Users**: Cross-organization user management
- **Settings**: System configuration
- **Quick Actions**: Configurable dashboard shortcuts

### Corporate Features
- **Dashboard**: Organization-specific analytics
- **Users**: Team member management
- **Roles & Permissions**: Access control
- **Settings**: Organization preferences

### Common Features
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Dynamic data refresh
- **Date Formatting**: Consistent DD-MM-YYYY format
- **Error Handling**: Comprehensive error management
- **Security**: JWT-based authentication

## Development Guidelines

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

### Naming Conventions
- **Components**: PascalCase (e.g., `CorporateDashboard`)
- **Files**: PascalCase for components, camelCase for utilities
- **API Endpoints**: kebab-case (e.g., `/super-admin/dashboard`)
- **Database**: snake_case (e.g., `organization_code`)

### Best Practices
- Use TypeScript interfaces for type safety
- Implement proper error handling
- Follow RESTful API conventions
- Use consistent date formatting
- Implement responsive design
- Add proper loading states

## Deployment

### Production Environment
1. **Backend Deployment**
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Frontend Deployment**
   ```bash
   npm run build
   # Deploy dist/ folder to web server
   ```

3. **Environment Configuration**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-domain.com
   
   DB_HOST=your-db-host
   DB_DATABASE=narad_pms_prod
   DB_USERNAME=your-db-user
   DB_PASSWORD=your-secure-password
   
   JWT_SECRET=your-jwt-secret
   ```

### Server Requirements
- PHP 8.2+
- MySQL 8.0+
- Nginx/Apache
- SSL Certificate
- Node.js (for build process)

## Troubleshooting

### Common Issues

#### PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### CORS Issues
```php
// config/cors.php
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:5173'],
```

#### JWT Token Issues
```bash
php artisan jwt:secret
php artisan config:clear
```

#### Database Connection
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=narad-pms
```

### Development URLs
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **Database**: narad-pms (MySQL)

### Default Credentials
- **Super Admin**: super@admin.com / password
- **Corporate Admin**: admin@{org}.com / 123456

## Support & Maintenance

### Version Information
- **Current Version**: 1.0.0
- **Laravel Version**: 12.44.0
- **React Version**: 18.x
- **Node.js Version**: 24.12.0+

### License
MIT License - See LICENSE file for details

### Contact
For technical support or questions, please refer to the development team.

---

*Last Updated: December 2025*