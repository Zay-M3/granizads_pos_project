# Granizados POS Project

A Point of Sale (POS) system for managing granizados (slushies/ice drinks) business operations.

## Project Architecture

This project follows a modular architecture pattern with clear separation between frontend and backend services.

### Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Project Management**: Agile methodology using Scrum
- **Issue Tracking**: [JIRA Project Link](https://proyectointegrador1organo.atlassian.net/jira/software/projects/GGP/boards/68/backlog?atlOrigin=eyJpIjoiNDBmYjlkNzUwZjhjNDU3ZmEwY2U3MzY3NjE3YWU4NGMiLCJwIjoiaiJ9) <!-- Add your JIRA project link here -->

## Architecture Overview

The application is built using a modular architecture to ensure scalability, maintainability, and separation of concerns.

### Frontend (React)

The frontend is organized using a component-based architecture:

- `/src/components` - Reusable UI components
- `/src/modules` - Feature-specific modules
- `/src/hooks` - Custom React hooks
- `/src/contexts` - React context providers
- `/src/services` - API service connectors
- `/src/utils` - Utility functions and helpers

#### File Naming Conventions

- React components: PascalCase (e.g., `ProductCard.jsx`)
- Utility files: camelCase (e.g., `formatCurrency.js`)
- Test files: `[filename].test.js`
- Style files: `[ComponentName].module.css`

### Backend (Node.js)

The backend follows a modular structure:

- `/src/api` - API routes and controllers
- `/src/modules` - Business logic modules
- `/src/models` - Database models
- `/src/services` - External service integrations
- `/src/utils` - Helper functions
- `/src/middleware` - Custom middleware

#### File Naming Conventions

- Files: kebab-case (e.g., `user-service.js`)
- Folders: kebab-case (e.g., `/user-management`)
- Test files: `[filename].test.js`

### Database (PostgreSQL)

The database schema is designed to support the various modules of the application:

- Customers
- Products
- Inventory
- Orders
- Transactions
- Users (Staff)
- Reports

## Development Workflow

This project follows the Scrum methodology for development:

1. Requirements are tracked in JIRA as user stories
2. Development is done in sprints
3. Code reviews are mandatory for all pull requests
4. CI/CD pipeline ensures quality through automated tests

