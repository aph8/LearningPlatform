# Learning Platform

A full-stack web application where teachers can create courses and assignments, invite students, and view their progress. Students can complete assignments and receive instant feedback with grading.

## Features

- Teachers can:
  - Create and manage courses
  - Add students to courses
  - Create and publish assignments
  - View grades and submissions

- Students can:
  - View assigned courses and assignments
  - Submit answers
  - Get instant feedback and scores

## Tech Stack

**Backend:**
- Node.js, Express
- Prisma (ORM)
- Zod (validation)
- Jest, Supertest
- Swagger (API docs)

**Frontend:**
- Next.js, React
- Zustand (state management)
- Sass (styling)
- React Hook Form + Zod (validation)
- Chart.js (stats)

## Setup

### Backend

cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev


### Frontend

cd frontend
npm install
npm run dev

## Known Issues
Partial image upload support

### Author
Andri Páll Helgason
