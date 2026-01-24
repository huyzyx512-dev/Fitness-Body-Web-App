# WORKOUT TRACKER BACKEND API

## 1. Thông tin chung

**Tên đồ án**: Xây dựng hệ thống Backend cho ứng dụng theo dõi tập luyện (Workout Tracker)

**Sinh viên thực hiện**: Nguyễn Xuân Huy
**Ngành / Chuyên ngành**: Công nghệ Thông tin
**Loại đồ án**: Đồ án tốt nghiệp / Project cuối kỳ

---

## 2. Mục tiêu đồ án

Đồ án nhằm mục tiêu xây dựng một hệ thống Backend hoàn chỉnh cho ứng dụng theo dõi tập luyện, cho phép người dùng:

* Đăng ký, đăng nhập và xác thực bằng JWT
* Tạo và quản lý kế hoạch tập luyện cá nhân
* Lên lịch các buổi tập theo ngày giờ
* Ghi nhận kết quả tập luyện (thời gian, calories, nhận xét)
* Thống kê và báo cáo tiến trình tập luyện

Thông qua đồ án, sinh viên áp dụng các kiến thức về:

* Thiết kế cơ sở dữ liệu quan hệ
* Xây dựng RESTful API
* Áp dụng OOP trong Backend
* Bảo mật với JWT
* Làm việc với ORM (Sequelize)

---

## 3. Công nghệ sử dụng

### Backend

* Node.js
* Express.js
* MySQL
* Sequelize ORM
* JSON Web Token (JWT)
* bcrypt

### Công cụ & thư viện hỗ trợ

* sequelize-cli
* dotenv
* nodemon
* Postman (test API)

---

## 4. Kiến trúc hệ thống

Hệ thống được xây dựng theo mô hình **Layered Architecture**, bao gồm:

```
Client (React)
     ↓
Routes
     ↓
Controllers (Xử lý request/response)
     ↓
Services (Business Logic)
     ↓
Models (Sequelize ORM)
     ↓
MySQL Database
```

Kiến trúc này giúp:

* Dễ bảo trì
* Dễ mở rộng
* Tách biệt rõ trách nhiệm từng tầng

---

## 5. Thiết kế cơ sở dữ liệu

### 5.1 Danh sách bảng chính

* users
* exercises
* workouts
* workout_exercises
* workout_logs

### 5.2 Quan hệ giữa các bảng

* User 1 – N Workout
* Workout 1 – N WorkoutExercise
* Exercise 1 – N WorkoutExercise
* Workout 1 – 1 WorkoutLog

(Có ERD diagram đính kèm trong báo cáo đồ án)

---

## 6. Đặc tả chức năng chính

### 6.1 Xác thực người dùng

* Đăng ký tài khoản
* Đăng nhập
* Sử dụng JWT để bảo vệ các API riêng tư

### 6.2 Quản lý bài tập (Exercise)

* Dữ liệu bài tập được seed sẵn
* Người dùng chỉ được phép xem

### 6.3 Quản lý Workout

* Tạo kế hoạch tập luyện
* Thêm nhiều bài tập vào một workout
* Cập nhật hoặc xóa workout
* Lên lịch thời gian tập

### 6.4 Ghi log & báo cáo

* Ghi nhận kết quả buổi tập
* Thống kê số buổi tập, calories, thời gian tập

---

## 7. RESTful API (Tóm tắt)

### Authentication

* POST /auth/register
* POST /auth/login

### Exercises

* GET /exercises

### Workouts

* POST /workouts
* GET /workouts
* PUT /workouts/:id
* DELETE /workouts/:id

### Workout Logs

* POST /workouts/:id/log

### Reports

* GET /reports/summary

---

## 8. Áp dụng lập trình hướng đối tượng (OOP)

* **Model**: Mỗi bảng CSDL tương ứng một class Sequelize
* **Service Layer**: Đóng gói business logic
* **Controller**: Chịu trách nhiệm xử lý HTTP request/response
* **Middleware**: Xử lý xác thực JWT

Nguyên lý OOP được áp dụng:

* Encapsulation
* Single Responsibility Principle
* Separation of Concerns

---

## 9. Cấu trúc thư mục

```
backend/
├─ src/
│  ├─ controllers/
│  ├─ services/
│  ├─ models/
│  ├─ routes/
│  ├─ middlewares/
│  ├─ migrations/
│  ├─ seeders/
│
├─ config/
├─ app.js
├─ server.js
```

---

## 10. Hướng dẫn cài đặt & chạy dự án

### 10.1 Cài đặt

```bash
npm install
```

### 10.2 Cấu hình môi trường

Tạo file `.env`

```
DB_HOST=localhost
DB_NAME=fitness_tracker
DB_USER=root
DB_PASSWORD=...
JWT_SECRET=your_secret_key
```

### 10.3 Migration & Seeder

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 10.4 Chạy server

```bash
npm run dev
```

---

## 11. Hướng phát triển trong tương lai

* Thêm role Admin
* Kết nối Frontend React
* Thêm AI nhận diện món ăn / bài tập
* Thêm biểu đồ thống kê nâng cao
* Deploy lên cloud

---

## 12. Kết luận

Đồ án đã xây dựng được một hệ thống Backend hoàn chỉnh cho ứng dụng theo dõi tập luyện, đáp ứng các yêu cầu về xác thực, quản lý dữ liệu, bảo mật và mở rộng. Thông qua đồ án, sinh viên đã củng cố kiến thức về Backend, cơ sở dữ liệu và kiến trúc phần mềm hiện đại.
