# Backend - Authentication Module

**Implemented:** `AuthService` in `auth_service.py` signs and verifies HS256 JWTs. Registration, logout, OAuth, password storage, and role-based authorization are not implemented here. The module imports PyJWT (`jwt`); no shared Python dependency manifest is provided.

User authentication and authorization for MAVUNO-GREEN-GRID platform.

## Overview

Handles user authentication, JWT tokens, and access control.

## Features

- User registration
- Login/logout
- Token management
- Role-based access control
- OAuth integration (not implemented)

## Security

All passwords are hashed and stored securely.
