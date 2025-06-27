# 🌟 User Management API

This project provides a **complete user management system** including:

✅ Authentication (login, super admin signup)  
✅ Role and permission management  
✅ Secure CRUD operations on users  
✅ Role assignment  
✅ API documentation with Swagger  

---

## 🚀 Features

- **Authentication**
  - Super admin manual signup
  - Login for all users with JWT tokens

- **User Management**
  - Create, update, delete users
  - Get details of any user
  - Get your own profile (`/me/details`)
  - Assign roles to users

- **Roles & Permissions**
  - List all roles
  - List all permissions

- **Seeder**
  - Internal endpoint to seed initial roles and permissions (restricted to developers)

---

## 🔐 Security and Validations

All protected endpoints require a **Bearer JWT token**.  

The following checks and validations are enforced across the APIs:

- **Super Admin Restrictions**
  - Only developer can manually create super admins
  - Super admin cannot be deleted or have their role changed via the API
  - Cannot create a super admin using general user creation endpoints
  - Both admins and super admins can create user , delete user , view details
  - Super admin can update user & assign new role but Normal Admin Cant

- **Email Validation**
  - Unique email enforced on user creation
  - Conflict returned if email already exists

- **Role Validation**
  - Cannot assign or create users with non-existent roles
  - Cannot assign super admin role to other users via the API

- **Self-protection**
  - Users cannot delete themselves

- **Input Validation**
  - Request bodies validated for required fields and formats (email, password)

---

## 🧾 API Documentation

**Swagger UI** is available for exploring and testing APIs interactively.

📄 **URL:**  
http://localhost:3001/api/v1/docs

---

## 📂 Project Structure Overview

/api/v1
/auth Authentication routes (signup, login)
/users User CRUD and role assignment
/roles Public roles listing
/permissions Public permissions listing
/models Mongoose models (User, Role, Permission)
/controllers Business logic for all endpoints
/middlewares Validation and authorization

---

## 📦 Install & Run

## -- For backend -----
Move into backend folder:
cd backend

npm install
npm run start // start with compiled code
npm run dev // run dev server (ts code directly)
npm run build // for compiling ts code to js

## Make sure you have a .env file with the following:

ENV:
JWT_SEC=your_jwt_secret
MONGO_PUBLIC_URL="mongodb_uri"

## -- For frontend -----
Move into frontend folder:
cd frontend/base

npm install
npm run dev

📄 License
MIT License