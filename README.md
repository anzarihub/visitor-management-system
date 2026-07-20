# Visitor Management System (VMS)

A modern Visitor Management System built for the Ethiopian Agricultural Transformation Institute (ATI).

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

### Backend

- Express.js
- TypeScript
- Prisma ORM
- MySQL
- Express Session

## Project Structure

```
visitor-management-system/
├── api/
├── client/
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd visitor-management-system
```

### 2. Install dependencies

Backend

```bash
cd api
pnpm install
```

Frontend

```bash
cd ../client
pnpm install
```

## Environment Variables

### Backend

Copy the example environment file.

```bash
cp .env.example .env
```

Update the values with your local database configuration.

### Frontend

Copy the example environment file.

```bash
cp .env.example .env.local
```

## Database

Run Prisma migrations.

```bash
cd api

pnpm prisma migrate dev

pnpm prisma generate
```

(Optional)

```bash
pnpm prisma db seed
```

## Running the Project

Backend

```bash
cd api

pnpm dev
```

Frontend

```bash
cd client

pnpm dev
```

Frontend:

```
http://localhost:3000
```

Backend:

```
http://localhost:5000
```

## Git Workflow

- Create a feature branch from `main`.
- Commit changes with meaningful commit messages.
- Push your branch.
- Open a Pull Request.
- Merge only after review.

Example:

```bash
git switch -c feature/visitor-registration
```
