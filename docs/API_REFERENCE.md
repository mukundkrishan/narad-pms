# Narad PMS - API Reference

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer {your-jwt-token}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    // Validation errors (if applicable)
  }
}
```

## Authentication Endpoints

### Super Admin Login
```http
POST /super/login
```

**Request Body:**
```json
{
  "email": "super@admin.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Super admin login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "super@admin.com",
      "role_id": 1
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

### Corporate Login
```http
POST /{organizationCode}/login
```

**Parameters:**
- `organizationCode` (string): Organization code (e.g., NET2025)

**Request Body:**
```json
{
  "email": "admin@company.com",
  "password": "123456"
}
```

## Dashboard Endpoints

### Super Admin Dashboard
```http
GET /super-admin/dashboard
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_organizations": 5,
    "active_organizations": 4,
    "total_users": 25,
    "active_users": 20,
    "total_revenue": 50000,
    "monthly_revenue": 15000,
    "recent_activities": [
      {
        "time": "2 hours ago",
        "text": "New organization 'TechCorp' registered",
        "type": "organization_created"
      }
    ],
    "quick_actions": [
      {
        "id": "organizations",
        "label": "Manage Organizations",
        "url": "/organizations",
        "type": "primary"
      }
    ]
  }
}
```

### Corporate Dashboard
```http
GET /corporate/dashboard
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "team_members": 10,
    "active_members": 8,
    "organization_info": {
      "id": 1,
      "name": "TechCorp Solutions",
      "organization_code": "NET2025",
      "status": "active",
      "user_allowed": 50,
      "valid_from": "2024-01-01",
      "valid_to": "2025-12-31"
    },
    "recent_activities": [
      {
        "time": "1 hour ago",
        "text": "User 'John Doe' joined",
        "type": "user_joined"
      }
    ],
    "user_roles": [
      {
        "role_id": 2,
        "count": 2
      },
      {
        "role_id": 3,
        "count": 8
      }
    ]
  }
}
```

## Organization Management

### List Organizations
```http
GET /organizations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "TechCorp Solutions",
      "organization_code": "NET2025",
      "email": "admin@techcorp.com",
      "phone": "+1234567890",
      "user_allowed": 50,
      "valid_from": "2025-01-01",
      "valid_to": "2026-12-31",
      "status": "active",
      "users_count": 10,
      "last_payment_amount": 5000,
      "last_payment_date": "2026-01-15"
    }
  ]
}
```

### Create Organization
```http
POST /organizations
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "New Company Ltd",
  "organization_code": "NEW2024",
  "email": "admin@newcompany.com",
  "phone": "+1234567890",
  "address": "123 Business Street",
  "user_allowed": 25,
  "valid_from": "2025-01-01",
  "valid_to": "2026-12-31",
  "last_payment_amount": 3000,
  "last_payment_date": "2025-01-01"
}
```

### Update Organization
```http
PUT /organizations/{id}
Authorization: Bearer {token}
```

### Delete Organization
```http
DELETE /organizations/{id}
Authorization: Bearer {token}
```

## User Management

### List Corporate Users
```http
GET /corporate/users
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@company.com",
        "mobile": "+1234567890",
        "role_id": 2,
        "status": "active",
        "created_at": "2026-01-15T10:30:00.000000Z"
      }
    ],
    "per_page": 10,
    "total": 1
  }
}
```

### Create Corporate User
```http
POST /corporate/users
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@company.com",
  "mobile": "+1234567891",
  "role_id": 3
}
```

## Settings Management

### Get User Settings
```http
GET /settings
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "app_name": "Narad PMS",
    "theme": "light",
    "items_per_page": "10",
    "quick_actions": [
      {
        "id": "organizations",
        "label": "Organizations",
        "url": "/organizations",
        "enabled": true
      }
    ]
  }
}
```

### Update Settings
```http
POST /settings
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "settings": {
    "theme": "dark",
    "items_per_page": "25",
    "email_notifications": true
  }
}
```

## Organization Info

### Get Organization by Code
```http
GET /organization/{organizationCode}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "TechCorp Solutions",
    "organization_code": "NET2025",
    "status": "active"
  }
}
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or missing authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server error |

## Rate Limiting

API requests are limited to:
- 60 requests per minute for authenticated users
- 10 requests per minute for unauthenticated requests

## Pagination

List endpoints support pagination with the following parameters:
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 10, max: 100)

**Example:**
```http
GET /organizations?page=2&per_page=20
```

## Date Format

All dates in API responses are in ISO 8601 format:
```
2025-12-31T10:30:00.000000Z
```

Frontend displays dates in DD-MM-YYYY format:
```
31-12-2025
```