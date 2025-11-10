# Teacher Course Management Features

## Tổng quan

Hệ thống quản lý khóa học cho giáo viên (Teacher) với đầy đủ chức năng CRUD và xem danh mục khóa học.

## Các File Mới Được Tạo

### 1. Models

- **`src/models/CourseModel.js`**: Model quản lý dữ liệu khóa học
  - Khởi tạo và lưu trữ danh sách courses
  - Các method: getAllCourses, getCoursesByInstructor, getCourseById, createCourse, updateCourse, deleteCourse, searchCourses, getCourseStats

### 2. Controllers

- **`src/controllers/CourseController.js`**: Controller xử lý logic nghiệp vụ
  - Xử lý tất cả các thao tác CRUD
  - Validation dữ liệu
  - Kiểm tra quyền truy cập
  - Tìm kiếm và thống kê

### 3. Views

- **`src/views/CourseManagementView.js`**: Giao diện quản lý khóa học cho Teacher

  - Hiển thị danh sách khóa học của giáo viên
  - Tạo khóa học mới
  - Chỉnh sửa khóa học
  - Xóa khóa học
  - Tìm kiếm khóa học

- **`src/views/CourseCatalogView.js`**: Giao diện xem danh mục tất cả khóa học
  - Hiển thị tất cả khóa học trong hệ thống
  - Tìm kiếm theo tiêu đề, mô tả, giáo viên
  - Lọc theo danh mục (Category)
  - Lọc theo cấp độ (Level)

### 4. Styles

- **`styles/course-management.scss`**: CSS styling cho Course Management (web only)

## Các File Được Cập Nhật

### 1. `src/views/dashboards/TeacherDashboard.js`

- Thêm props: `user`, `onNavigateToCourseManagement`, `onNavigateToCourseCatalog`
- Hiển thị thống kê thực tế từ CourseController
- Thêm nút điều hướng đến Course Management
- Thêm nút điều hướng đến Course Catalog

### 2. `src/views/HomeView.js`

- Import CourseManagementView và CourseCatalogView
- Thêm state để quản lý điều hướng
- Truyền props cần thiết cho TeacherDashboard

### 3. `src/database/db.js`

- Thêm các trường mới cho mockCourses:
  - `category`: Danh mục khóa học
  - `level`: Cấp độ (Beginner, Intermediate, Advanced)
  - `createdAt`: Thời gian tạo
  - `updatedAt`: Thời gian cập nhật

## Chức Năng Chính

### 1. Create Course (Tạo Khóa Học)

- Nhấn nút "+" trên header của Course Management
- Điền thông tin:
  - Title (bắt buộc)
  - Description (bắt buộc)
  - Duration
  - Category
  - Level (Beginner/Intermediate/Advanced)
  - Image URL (optional)
- Nhấn "Create" để lưu

### 2. Read Course (Xem Khóa Học)

- **My Courses**: Xem danh sách khóa học của giáo viên
- **Course Catalog**: Xem tất cả khóa học trong hệ thống
- Hiển thị đầy đủ thông tin:
  - Tiêu đề
  - Mô tả
  - Giáo viên
  - Thời lượng
  - Số học viên
  - Đánh giá
  - Danh mục
  - Cấp độ

### 3. Update Course (Cập Nhật Khóa Học)

- Nhấn nút "Edit" trên course card
- Chỉnh sửa thông tin
- Nhấn "Update" để lưu
- Chỉ được phép cập nhật khóa học của chính mình

### 4. Delete Course (Xóa Khóa Học)

- Nhấn nút "Delete" trên course card
- Xác nhận xóa
- Chỉ được phép xóa khóa học của chính mình

### 5. View Course Catalog (Xem Danh Mục Khóa Học)

- Xem tất cả khóa học có sẵn
- Tìm kiếm theo từ khóa
- Lọc theo Category: All, Programming, Design, Business, General
- Lọc theo Level: All, Beginner, Intermediate, Advanced
- Hiển thị số lượng khóa học tìm được

## Tính Năng Nổi Bật

### 1. Search (Tìm Kiếm)

- Tìm kiếm theo tiêu đề, mô tả, tên giáo viên
- Cập nhật kết quả real-time khi nhập

### 2. Filter (Lọc)

- Lọc theo danh mục khóa học
- Lọc theo cấp độ
- Kết hợp nhiều bộ lọc

### 3. Statistics (Thống Kê)

- Hiển thị tổng số khóa học
- Tổng số học viên
- Đánh giá trung bình

### 4. Validation & Security

- Kiểm tra dữ liệu đầu vào
- Chỉ cho phép giáo viên chỉnh sửa/xóa khóa học của mình
- Hiển thị thông báo lỗi rõ ràng

### 5. UI/UX

- Giao diện thân thiện, dễ sử dụng
- Responsive design
- Hiệu ứng hover và transition mượt mà
- Empty state khi không có dữ liệu
- Modal dialog cho form tạo/sửa

## Cách Sử Dụng

### Đăng Nhập

```
Email: teacher@example.com
Password: teacher123
```

### Truy Cập Chức Năng

1. Đăng nhập với tài khoản Teacher
2. Tại Dashboard, nhấn vào:
   - **"Manage Courses"** để quản lý khóa học của bạn
   - **"Course Catalog"** để xem tất cả khóa học

### Tạo Khóa Học Mới

1. Vào Course Management
2. Nhấn nút "+" ở góc phải header
3. Điền thông tin khóa học
4. Chọn Level
5. Nhấn "Create"

### Chỉnh Sửa Khóa Học

1. Vào Course Management
2. Tìm khóa học cần sửa
3. Nhấn nút "Edit"
4. Cập nhật thông tin
5. Nhấn "Update"

### Xóa Khóa Học

1. Vào Course Management
2. Tìm khóa học cần xóa
3. Nhấn nút "Delete"
4. Xác nhận xóa

### Xem Danh Mục

1. Vào Course Catalog
2. Dùng thanh tìm kiếm để tìm khóa học
3. Chọn Category và Level để lọc
4. Nhấn "View Details" để xem chi tiết

## Công Nghệ Sử dụng

- React Native
- Expo
- React Hooks (useState, useEffect)
- Modal component
- ScrollView, TouchableOpacity
- Ionicons
- SCSS (web only)

## Cấu Trúc Dữ Liệu Course

```javascript
{
  id: number,
  title: string,
  instructor: string,
  description: string,
  duration: string,
  students: number,
  rating: number,
  image: string,
  category: string,
  level: string,
  createdAt: string (ISO date),
  updatedAt: string (ISO date)
}
```

## Notes

- Dữ liệu hiện tại lưu trong memory (mock data)
- Để persist data, cần kết nối với backend API hoặc local storage
- Teacher chỉ được phép quản lý khóa học của chính mình
- Admin có thể xem và quản lý tất cả khóa học (có thể mở rộng)
