# AssetOps - IT Asset Management & Operations Platform

AssetOps is a modern, responsive web application designed for comprehensive enterprise IT asset management, inventory tracking, employee assignment, and operational analytics. Built with React 19, TypeScript, Vite, and Tailwind CSS, it offers an intuitive interface with role-based access control, interactive data visualizations, and robust client-side state persistence.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Run Commands](#run-commands)
- [Project Structure](#project-structure)
- [API / Backend Setup](#api--backend-setup)
- [Authentication & Role-Based Access Control](#authentication--role-based-access-control)
- [Testing](#testing)
- [Deployment & CI/CD](#deployment--cicd)

---

## Project Overview

AssetOps streamlines the entire asset lifecycle for IT and operations teams. It enables organizations to:

- Track enterprise hardware, software licenses, and peripherals across departments.
- Allocate and deallocate equipment to employees with complete assignment history.
- Monitor asset health, warranties, maintenance schedules, and operational statuses.
- Visualize real-time inventory metrics, department distributions, and growth trends through interactive dashboards.
- Enforce strict role-based access controls across different organizational personas (Admin, Manager, Viewer).

---

## Key Features

- **Dashboard & Analytics**: Overview cards, category distribution charts, asset growth trends, and customizable widget views.
- **Asset Inventory Management**: Search, multi-criteria filtering, sorting, pagination, virtualized list view for high performance, custom column visibility, and CSV bulk import/export.
- **Employee Directory**: Manage team members, departmental associations, and their actively assigned assets.
- **Asset Allocation Flow**: Modal-driven workflows to assign, reassign, or return devices.
- **Reports & Insights**: Real-time KPI summaries, asset distribution by department, and operational reporting tools.
- **Role-Based Permissions (RBAC)**: Fine-grained access control protecting routes and interactive actions.
- **Persistent State**: LocalStorage-backed Zustand stores ensuring mock data updates and user sessions persist across page refreshes.
- **Modern UI & Dark Mode**: Responsive design built with Tailwind CSS v4, Lucide icons, and Base UI components.

---

## Tech Stack

### Core Technologies

- **[React](https://react.dev/) (v19.2)** - Component-based user interface library
- **[TypeScript](https://www.typescriptlang.org/) (v6.0)** - Static type checking and enhanced developer experience
- **[Vite](https://vite.dev/) (v8.2)** - Fast build tool and development server

### Styling & UI Components

- **[Tailwind CSS](https://tailwindcss.com/) (v4.3)** & **[@tailwindcss/vite](https://tailwindcss.com/)** - Utility-first CSS framework
- **[@base-ui/react](https://base-ui.com/) (v1.7)** - Unstyled, accessible UI primitives
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[clsx](https://github.com/lukeed/clsx)** & **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Dynamic and conflict-free class name utilities
- **[class-variance-authority](https://cva.style/docs)** - Component variant styling management

### State Management & Routing

- **[Zustand](https://zustand-demo.pmnd.rs/) (v5.0)** - Lightweight client-side state management with `persist` middleware
- **[React Router DOM](https://reactrouter.com/) (v7.18)** - Declarative client-side routing and layout guards

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com/) (v7.86)** - High-performance form state handling
- **[Zod](https://zod.dev/) (v4.4)** - TypeScript-first schema validation with static type inference
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Zod integration for React Hook Form

### Data Visualization & Virtualization

- **[Recharts](https://recharts.org/) (v3.10)** - Composable charting library built on React components
- **[@tanstack/react-virtual](https://tanstack.com/virtual)** - Headless UI for virtualizing large asset lists

### Testing & Tooling

- **[Vitest](https://vitest.dev/) (v4.1)** - Blazing-fast unit and component test runner
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** & **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - DOM and component test utilities
- **[JSDOM](https://github.com/jsdom/jsdom)** - Headless browser environment for testing
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Code coverage reporting using V8
- **[ESLint](https://eslint.org/) (v10.9)** & **[typescript-eslint](https://typescript-eslint.io/)** - Linting and code quality
- **[Prettier](https://prettier.io/) (v3.9)** - Opinionated code formatting

---

## Prerequisites

Before running the project locally, ensure you have the following installed:

- **Node.js**: `v20.0.0` or higher (Node.js 20 LTS recommended, matching CI)
- **Package Manager**: `npm` (v10+ recommended) or compatible alternative (`pnpm` / `yarn`)

Verify your installation:

```bash
node -v
npm -v
```

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd assetops
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Verify the installation by running tests or launching the dev server**:
   ```bash
   npm run test
   npm run dev
   ```

---

## Environment Variables

The application currently operates as a standalone client-side Single Page Application (SPA) with an in-memory/localStorage mock data layer.

- **Required Environment Variables**: None at this stage.
- **Vite Default Behavior**: If you need to add environment variables in the future, prefix them with `VITE_` (e.g., `VITE_API_BASE_URL`) and place them in a `.env` or `.env.local` file in the project root. They will be accessible via `import.meta.env`.

---

## Run Commands

The following scripts are configured in `package.json`:

| Command                 | Description                                                                                      |
| :---------------------- | :----------------------------------------------------------------------------------------------- |
| `npm run dev`           | Starts the Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173`. |
| `npm run build`         | Compiles TypeScript (`tsc -b`) and bundles production assets with Vite into `dist/`.             |
| `npm run preview`       | Serves the production build locally for verification.                                            |
| `npm run lint`          | Runs ESLint across all TypeScript and JavaScript files.                                          |
| `npm run format`        | Formats all files using Prettier.                                                                |
| `npm run format:check`  | Checks code formatting against Prettier rules without making changes.                            |
| `npm run test`          | Runs the test suite once with Vitest.                                                            |
| `npm run test:watch`    | Launches Vitest in interactive watch mode.                                                       |
| `npm run test:coverage` | Runs Vitest and generates a V8 code coverage report.                                             |

---

## Project Structure

assetops/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline (lint, test, build)
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images and static media
│   ├── components/              # Modular UI components
│   │   ├── allocations/         # Allocation modals and assignment tables
│   │   ├── assets/              # Asset tables, visualizers, modals (Add/Edit/Delete/Import)
│   │   ├── common/              # Shared feedback UI (EmptyState, ErrorState, LoadingState)
│   │   ├── dashboard/           # Dashboard summary cards, metric widgets, chart sections
│   │   ├── employees/           # Employee tables, details, department views
│   │   ├── reports/             # Analytics charts, report filters, generation modal
│   │   └── ui/                  # Reusable Base UI and styled primitives (button, dialog, select, etc.)
│   ├── constans/                # Application constants & permission definitions
│   │   ├── asset.constants.ts   # Default filter configs, categories, statuses
│   │   ├── auth.constants.ts    # Role-to-permission mapping matrices
│   │   ├── dashboard.constants.ts
│   │   └── employee.constants.ts
│   ├── hooks/                   # Custom React hooks (usePermission, useDebounce, use-mobile)
│   ├── layout/                  # Shared layouts (Dashboardlayout with Sidebar & Topbar)
│   ├── lib/                     # Helper utilities (cn / clsx / tailwind-merge)
│   ├── mocks/                   # Mock seed data (assets, employees, users)
│   ├── pages/                   # Application route views
│   │   ├── auth/                # LoginPage
│   │   ├── AllocationsPage.tsx  # Asset assignment & tracking view
│   │   ├── AssetListPage.tsx    # Inventory table & virtualized visualizer
│   │   ├── Dashboard.tsx        # Central metric overview & activity
│   │   ├── EmployeeListPage.tsx # Employee directory management
│   │   ├── HistoryPage.tsx      # Activity audit log view
│   │   ├── NotFoundPage.tsx     # 404 error page
│   │   ├── ReportsPage.tsx      # Analytics & export view
│   │   ├── SettingsPage.tsx     # System & role configuration view
│   │   └── UnauthorizedPage.tsx # 403 access denied page
│   ├── routes/                  # React Router configuration & guards
│   │   ├── AppRoutes.tsx        # Central route tree
│   │   ├── PermissionRoute.tsx  # Guard checking role and permission requirements
│   │   ├── ProtectedRoute.tsx   # Guard enforcing authentication
│   │   └── PublicOnlyRoute.tsx  # Guard restricting login access for authenticated users
│   ├── schemas/                 # Zod validation schemas (asset, auth, employee, filter preset)
│   ├── store/                   # Zustand global stores with persistence
│   │   ├── useAssetFilterPresetStore.ts
│   │   ├── useAssetFilterStore.ts
│   │   ├── useAssetStore.ts
│   │   ├── useAuthStore.ts
│   │   ├── useColumnVisibilityStore.ts
│   │   ├── useDashboardStore.ts
│   │   ├── useEmployeeStore.ts
│   │   └── useSidebarStore.ts
│   ├── test/                    # Global test configuration and setup (setup.ts)
│   ├── types/                   # TypeScript interfaces (asset, auth, employee, permissions)
│   ├── utils/                   # Business helper functions (department filters, URL params)
│   ├── App.tsx                  # Root app component
│   ├── index.css                # Global CSS with Tailwind setup
│   └── main.tsx                 # Application entry point
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML entry page
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript project references
├── tsconfig.app.json            # TypeScript frontend configuration
├── tsconfig.node.json           # TypeScript node/tooling configuration
└── vite.config.ts               # Vite & Vitest configuration

---

## API / Backend Setup

### Current Architecture

AssetOps currently functions as a **frontend-first application** utilizing a mock data layer:

- **Mock Seed Layer**: Initial assets, employees, and users are seeded from `src/mocks/seed/`.
- **Client Persistence**: Zustand stores leverage `localStorage` (e.g., `assetops_auth_store`, `assetops_assets_store`, `assetops_employees_store`) to persist CRUD mutations locally across page reloads without requiring an external database.
- **Async Latency Simulation**: Mock operations (such as authentication) include simulated network delay to test loading spinners and asynchronous UI states.

### Future Backend Integration

When integrating with a live REST or GraphQL backend API:

1. Configure the API endpoint via a Vite environment variable (e.g. `VITE_API_BASE_URL`).
2. Replace or wrap the mock store actions in `src/store/` with API service calls using `fetch` or `axios`.
3. Update `useAuthStore` to manage JWT/session tokens with HTTP-only cookies or Authorization headers.

---

## Authentication & Role-Based Access Control

### Authentication Flow

1. Users authenticate via `/login` using email and password.
2. Form submission is validated using **Zod** (`auth.schema.ts`) and **React Hook Form**.
3. Credentials are authenticated against registered users in `src/mocks/seed/users.ts`.
4. Upon successful login, the authenticated user profile is saved to `useAuthStore` and persisted in `localStorage`.

### Demo Accounts

Pre-configured accounts are provided on the login page for quick testing:

| Role        | Email                  | Password      | Access Level                                                                      |
| :---------- | :--------------------- | :------------ | :-------------------------------------------------------------------------------- |
| **Admin**   | `admin@assetops.com`   | `password123` | Full system access (Dashboard, Assets, Employees, Allocations, Reports, Settings) |
| **Manager** | `manager@assetops.com` | `password123` | Operational access (Dashboard, Assets create/edit, Employees view, History)       |
| **Viewer**  | `viewer@assetops.com`  | `password123` | Read-only access (Dashboard, Assets view, History)                                |

### Role & Permission Matrix

Permissions are defined in `src/types/permissions.ts` and mapped to roles in `src/constans/auth.constants.ts`:

| Permission         | Description                              | Admin | Manager | Viewer |
| :----------------- | :--------------------------------------- | :---: | :-----: | :----: |
| `VIEW_DASHBOARD`   | Access overview dashboard & metrics      |  Yes  |   Yes   |  Yes   |
| `VIEW_ASSETS`      | View asset inventory & details           |  Yes  |   Yes   |  Yes   |
| `CREATE_ASSET`     | Add new assets to inventory              |  Yes  |   Yes   |   No   |
| `EDIT_ASSET`       | Update existing asset records            |  Yes  |   Yes   |   No   |
| `DELETE_ASSET`     | Remove assets from inventory             |  Yes  |   No    |   No   |
| `ALLOCATE_ASSET`   | Allocate/deallocate assets to employees  |  Yes  |   No    |   No   |
| `VIEW_EMPLOYEES`   | View employee directory                  |  Yes  |   Yes   |   No   |
| `MANAGE_EMPLOYEES` | Create, edit, and manage employees       |  Yes  |   No    |   No   |
| `VIEW_HISTORY`     | View asset & allocation audit history    |  Yes  |   Yes   |  Yes   |
| `VIEW_REPORTS`     | View analytics charts & export reports   |  Yes  |   No    |   No   |
| `MANAGE_SETTINGS`  | Configure organization & system settings |  Yes  |   No    |   No   |

### Route Guards

- **`ProtectedRoute`**: Restricts unauthenticated access, redirecting unauthorized users to `/login`.
- **`PublicOnlyRoute`**: Prevents authenticated users from accessing public authentication screens like `/login`.
- **`PermissionRoute`**: Validates whether the current user has the required permission for a given path. Unauthorized attempts are redirected to `/unauthorized` (HTTP 403 view).

---

## Testing

AssetOps uses **Vitest** with **React Testing Library** and **JSDOM** to ensure code reliability across components, pages, stores, schemas, and hooks.

### Running Tests

- **Run all tests once**:

  ```bash
  npm run test
  ```

- **Run tests in interactive watch mode**:

  ```bash
  npm run test:watch
  ```

- **Generate a test coverage report**:
  ```bash
  npm run test:coverage
  ```

### Test Organization

Tests are colocated alongside their implementation files in `__tests__/` directories:

- `src/components/**/__tests__/` - Component rendering, user events, and modal workflows
- `src/pages/**/__tests__/` - Full page integrations and filter interactions
- `src/store/__tests__/` - Zustand store actions, filtering logic, and state persistence
- `src/schemas/__tests__/` - Zod validation schema boundaries and constraints
- `src/hooks/__tests__/` - Custom hooks (`usePermission`, `useDebounce`)
- `src/routes/__tests__/` - Route protection and redirection behavior

---

## Deployment & CI/CD

### Production Build

To create a production build:

```bash
npm run build
```

This compiles TypeScript using `tsc -b` and bundles static assets with Vite into the `dist/` folder:

- Output directory: `dist/`
- Contains minified JavaScript bundles, compiled CSS, and HTML entry point.

### Previewing the Build

To preview the generated production build locally:

```bash
npm run preview
```

### Static Hosting

The output `dist/` directory can be deployed to any modern static hosting provider:

- **Vercel** / **Netlify** / **Cloudflare Pages**
- **GitHub Pages** / **GitLab Pages**
- **AWS S3 + CloudFront** / **Nginx**

_Note for SPA Routing_: Ensure your web server or host is configured to rewrite all non-file route requests to `/index.html`.

### Continuous Integration (CI)

A GitHub Actions workflow is configured in `.github/workflows/ci.yml` that runs on pushes and pull requests to validate:

1. Code formatting check (`npm run format:check`)
2. ESLint checks (`npm run lint`)
3. Unit and integration tests with coverage (`npm run test:coverage`)
4. Production application build (`npm run build`)
