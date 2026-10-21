# HR Portal

A modern employee management dashboard built with React and Vite. This project provides separate experiences for HR managers and employees, including employee records management, profile editing, and leave tracking.

## Overview

HR Portal is a simple but functional internal portal for managing employees and handling leave requests. It includes:

- HR dashboard for managing employees
- Employee profile management
- Leave request pages for both HR and employees
- Role-based access control
- Persistent local mock backend using JSON Server
- Authentication with session storage and hashed passwords

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- React Hook Form
- React Hot Toast
- Lucide React
- JSON Server
- bcryptjs

## Features

### HR Features
- View and search employee records
- Add new employees
- Edit employee details
- Delete/deactivate employee records
- Review and manage leave requests

### Employee Features
- View and update personal profile information
- Submit or review leave requests
- Access a role-specific dashboard and navigation

### Authentication
- Login and registration flows
- User role-based route protection
- Session-based authentication using `sessionStorage`
- Remember me option

## Project Structure

```bash
HRportal/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── DashboardLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── employee/
│   │   │   ├── Leave.jsx
│   │   │   └── Profile.jsx
│   │   └── hr/
│   │       ├── Employees.jsx
│   │       └── Leave.jsx
│   ├── services/
│   │   └── api.js
│   ├── index.css
│   ├── main.jsx
│   └── ...
├── db.json
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
├── .oxlintrc.json
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the mock backend

The app uses JSON Server to serve data from `db.json`.

```bash
npm run server
```

### 3. Start the frontend

Open a new terminal and run:

```bash
npm run dev
```

Then visit the local Vite URL shown in the terminal (typically http://localhost:5173).

## Available Scripts

```bash
npm run dev     # Start the Vite development server
npm run build   # Build the production bundle
npm run preview # Preview the production build
npm run server  # Start the JSON Server mock API on port 3001
npm run lint    # Run the linter
```

## Demo Accounts

The app includes pre-configured demo accounts in `db.json`.

### HR Manager
- Email: `hr@company.com`
- Password: `password123`

### Employee
- Email: `employee@company.com`
- Password: `password123`

## API Configuration

The frontend API client is configured in `src/services/api.js` to connect to:

```javascript
http://localhost:3001
```

The mock data is stored in `db.json` and managed by JSON Server.

## Notes

- This project is intended as a demo/admin portal and uses local mock data.
- The app is role-based and redirects users depending on their account type.
- Registration creates both an employee record and a user login entry.

## License

This project is for educational/demo purposes.

## Author

Built as a small HR management portal prototype.
