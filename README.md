<div align="center">
  <h1>💪 Workout Tracker Backend API</h1>
  
  <p>
    <strong>Short Description:</strong> A backend system for a workout tracking application, providing RESTful APIs for user authentication, workout planning, scheduling, and progress tracking. Built with Node.js, Express, and MySQL using a layered architecture for scalability and maintainability.
  </p>

  <br />

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=node.js&logoColor=white" />
    <img src="https://img.shields.io/badge/Express.js-4-black?style=for-the-badge&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/MySQL-8-00758F?style=for-the-badge&logo=mysql&logoColor=white" />
    <img src="https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" />
    <img src="https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
    <img src="https://img.shields.io/badge/Bcrypt-Security-blue?style=for-the-badge" />
  </p>
</div>

<br />

## ✨ Key Features

- 🔐 User Authentication (Register / Login with JWT)
- 🏋️ Workout Management (Create, update, delete workout plans)
- 📅 Workout Scheduling (Plan workouts by date and time)
- 📊 Workout Logging (Track duration, calories, notes)
- 📈 Progress Reports (Summary statistics of workouts)
- 🛡️ Security: Password hashing (bcrypt), JWT protection

<br />

## 🎯 Project Objectives

This project aims to build a complete backend system for a workout tracking application, allowing users to:

- Register and authenticate using JWT
- Manage personal workout plans
- Schedule workout sessions
- Record workout results
- Analyze training progress

Additionally, the project demonstrates:

- Relational database design
- RESTful API development
- Backend OOP practices
- Secure authentication with JWT
- ORM usage with Sequelize

<br />

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JSON Web Token (JWT)
- bcrypt

### Tools & Utilities
- sequelize-cli
- dotenv
- nodemon
- Postman (API testing)

<br />

## 🏗️ System Architecture
```
The system follows a **Layered Architecture**:
Client (React)
↓
Routes
↓
Controllers
↓
Services (Business Logic)
↓
Models (Sequelize ORM)
↓
MySQL Database
```

### Benefits:
- Clear separation of concerns
- Easy to maintain and extend
- Scalable structure

<br />

## 🗄️ Database Design

### Main Tables

- users
- exercises
- workouts
- workout_exercises
- workout_logs

### Relationships

- User (1) → (N) Workout  
- Workout (1) → (N) WorkoutExercise  
- Exercise (1) → (N) WorkoutExercise  
- Workout (1) → (1) WorkoutLog  

> ERD diagram is included in the project report.

<br />

## 🔧 Core Functionalities

### 🔐 Authentication
- Register
- Login
- JWT-based authorization

### 🏋️ Exercises
- Pre-seeded exercise data
- Read-only access for users

### 📅 Workouts
- Create workout plans
- Add multiple exercises
- Update / delete workouts
- Schedule workouts

### 📊 Logs & Reports
- Record workout results
- Generate summary statistics (duration, calories, sessions)

<br />

## 📡 RESTful API (Overview)

### Authentication
- `POST /auth/register`
- `POST /auth/login`

### Exercises
- `GET /exercises`

### Workouts
- `POST /workouts`
- `GET /workouts`
- `PUT /workouts/:id`
- `DELETE /workouts/:id`

### Workout Logs
- `POST /workouts/:id/log`

### Reports
- `GET /reports/summary`

<br />

## 🧠 OOP & Design Principles

- **Model:** Sequelize models represent database tables
- **Service Layer:** Handles business logic
- **Controller:** Handles HTTP request/response
- **Middleware:** JWT authentication

### Principles Applied:
- Encapsulation
- Single Responsibility Principle
- Separation of Concerns

<br />

## 📂 Project Structure
```
backend/
├─ src/
│ ├─ controllers/
│ ├─ services/
│ ├─ models/
│ ├─ routes/
│ ├─ middlewares/
│ ├─ migrations/
│ ├─ seeders/
│
├─ config/
├─ app.js
├─ server.js
```
<br />

## ⚙️ Getting Started

### Installation

```bash
npm install
```

Environment Configuration

Create a .env file:
```
DB_HOST=localhost
DB_NAME=fitness_tracker
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```
Migration & Seeder
```
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
Run Server
npm run dev
```
<br />

## 📌 Future Improvements

Add Admin role & role-based access control
Integrate React frontend
Add AI-based recommendations (food/workout)
Advanced analytics & charts
Deploy to cloud (AWS / Render / Docker)
<br />

## 📄 Conclusion

This project successfully builds a complete backend system for a workout tracking application, covering authentication, data management, and system architecture. It demonstrates strong backend development skills and understanding of modern software design principles.

<br />
👨‍💻 Author
Nguyễn Xuân Huy
GitHub: https://github.com/huyzyx512-dev
