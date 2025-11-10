# Learner Features Update

## Tổng quan

Cập nhật tính năng cho Learner (User) trong hệ thống Eduling Go với 3 chức năng chính:

1. **My Courses** - Quản lý khóa học đã đăng ký
2. **View Profile** - Xem và chỉnh sửa thông tin cá nhân
3. **My Feedbacks** - Quản lý đánh giá khóa học

## Các thay đổi chính

### 1. Dashboard (LearnerDashboard.js)

- **Statistics (3 cards ở trên):**

  - Enrolled: Tổng số khóa học đã đăng ký
  - Completed: Số khóa học đã hoàn thành
  - In Progress: Số khóa học đang học
  - _Dữ liệu được cập nhật động từ EnrollmentModel_

- **Action Cards (3 nút chính):**
  - **My Courses**: Xem và quản lý các khóa học, quản lý feedback
  - **View Profile**: Xem và chỉnh sửa thông tin cá nhân
  - **My Feedbacks**: Xem tất cả feedback đã gửi

### 2. Bottom Navigation

- Tab "Courses" giờ sẽ navigate đến **My Courses View**
- Giữ nguyên các tab khác: Home, Progress, Assignments

### 3. My Courses View (`src/views/courses/MyCoursesView.js`)

#### Tính năng:

- Hiển thị danh sách tất cả khóa học đã đăng ký
- Hiển thị thông tin:
  - Tên khóa học
  - Ngày đăng ký
  - Trạng thái (Enrolled, In Progress, Completed)
  - Progress bar (% hoàn thành)
  - Chi tiết khóa học (Duration, Level, Rating)

#### Quản lý Feedback:

- Nút "Manage Feedback" cho mỗi khóa học
- **Add Feedback**: Nếu chưa có feedback
  - Chọn rating (1-5 sao)
  - Nhập comment
- **Edit Feedback**: Nếu đã có feedback
  - Sửa rating và comment
  - Hiển thị feedback hiện tại
- **Delete Feedback**: Xóa feedback đã tạo

### 4. Profile View (`src/views/profiles/ProfileView.js`)

#### Tính năng:

- **View Mode**: Hiển thị thông tin

  - Avatar
  - Name
  - Email (không thể sửa)
  - Role badge
  - Joined Date
  - Status
  - Statistics (Enrolled/Completed courses)

- **Edit Mode**: Chỉnh sửa thông tin
  - Name
  - Avatar URL
  - Status (Available/Unavailable)
  - Nút Save/Cancel

### 5. My Feedbacks View (`src/views/feedbacks/MyFeedbacksView.js`)

#### Tính năng:

- Hiển thị tất cả feedbacks của user
- **Summary Card**:
  - Tổng số feedbacks
  - Average rating
- **Feedback List**:
  - Course name
  - Rating (stars)
  - Comment
  - Date (Created/Updated)
  - Nút "View Course" - navigate đến khóa học

## Models mới

### 1. EnrollmentModel (`src/models/EnrollmentModel.js`)

Quản lý enrollment (đăng ký khóa học)

#### Methods:

- `getUserEnrollments(userEmail)` - Lấy tất cả enrollments của user
- `getEnrollmentById(id)` - Lấy enrollment theo ID
- `getUserEnrollmentsByStatus(userEmail, status)` - Lọc theo status
- `getUserEnrollmentStats(userEmail)` - Thống kê enrollments
- `createEnrollment(enrollmentData)` - Tạo enrollment mới
- `updateEnrollmentProgress(id, progress)` - Cập nhật progress
- `updateEnrollmentStatus(id, status)` - Cập nhật status
- `deleteEnrollment(id)` - Xóa enrollment

### 2. FeedbackModel (`src/models/FeedbackModel.js`)

Quản lý feedback (đánh giá khóa học)

#### Methods:

- `getUserFeedbacks(userEmail)` - Lấy tất cả feedbacks của user
- `getCourseFeedbacks(courseId)` - Lấy feedbacks của khóa học
- `getFeedbackById(id)` - Lấy feedback theo ID
- `createFeedback(feedbackData)` - Tạo feedback mới
- `updateFeedback(id, updates)` - Cập nhật feedback
- `deleteFeedback(id)` - Xóa feedback
- `getCourseAverageRating(courseId)` - Tính rating trung bình

## Database Updates (`src/database/db.js`)

### Mock Users - Thêm 2 learner mới:

1. **learner2@example.com** (John Smith)

   - 3 enrollments
   - 1 completed

2. **learner3@example.com** (Emma Wilson)
   - 4 enrollments
   - 3 completed

### Mock Enrollments (12 records):

- learner@example.com: 5 enrollments (2 completed, 3 in-progress)
- learner2@example.com: 3 enrollments (1 completed, 2 in-progress)
- learner3@example.com: 4 enrollments (3 completed, 1 in-progress)

### Mock Feedbacks (15 records):

- learner@example.com: 5 feedbacks
- learner2@example.com: 3 feedbacks
- learner3@example.com: 4 feedbacks
- teacher@example.com: 3 feedbacks

## Navigation Flow

### App.js - Views mới:

- `myCourses` - MyCoursesView
- `profile` - ProfileView
- `myFeedbacks` - MyFeedbacksView

### Navigation từ Dashboard:

```
LearnerDashboard
├── My Courses → MyCoursesView
│   └── Manage Feedback → Modal (Add/Edit/Delete)
├── View Profile → ProfileView
│   └── Edit Mode → Save/Cancel
└── My Feedbacks → MyFeedbacksView
    └── View Course → MyCoursesView
```

### Navigation từ Bottom Tab:

```
Bottom Navigation
├── Home → LearnerDashboard
├── Courses → MyCoursesView
├── Progress → (To be implemented)
└── Assignments → (To be implemented)
```

## Testing Data

### Test Accounts:

1. **learner@example.com** / learner123

   - 5 khóa học (2 completed, 3 in-progress)
   - 5 feedbacks

2. **learner2@example.com** / learner123

   - 3 khóa học (1 completed, 2 in-progress)
   - 3 feedbacks

3. **learner3@example.com** / learner123
   - 4 khóa học (3 completed, 1 in-progress)
   - 4 feedbacks

### Enrollment Status:

- `enrolled` - Mới đăng ký, chưa bắt đầu (progress = 0%)
- `in-progress` - Đang học (0% < progress < 100%)
- `completed` - Đã hoàn thành (progress = 100%)

## UI/UX Features

### Màu sắc theo Status:

- **Enrolled**: Gray (#6B7280)
- **In Progress**: Orange (#F59E0B)
- **Completed**: Green (#10B981)

### Icons:

- Enrolled: `school`
- In Progress: `time`
- Completed: `checkmark-circle`
- Feedback: `chatbubbles`
- Profile: `person`
- Rating: `star`

### Components:

- Progress bars với % hiển thị
- Star rating (1-5 stars)
- Modal cho feedback management
- Empty states với icons
- Loading states với ActivityIndicator
- Alert confirmations cho delete actions

## Các file được tạo/sửa

### Files mới:

1. `src/models/EnrollmentModel.js`
2. `src/models/FeedbackModel.js`
3. `src/views/courses/MyCoursesView.js`
4. `src/views/profiles/ProfileView.js`
5. `src/views/feedbacks/MyFeedbacksView.js`

### Files đã sửa:

1. `src/database/db.js` - Thêm mockEnrollments, mockFeedbacks, users mới
2. `src/views/dashboards/LearnerDashboard.js` - Cập nhật UI và props
3. `src/views/HomeView.js` - Thêm navigation props
4. `App.js` - Thêm views mới và navigation logic

## Lưu ý

- Tất cả data là mock data (không có backend thật)
- Các thay đổi được lưu trong memory, sẽ mất khi refresh
- ESLint warnings về prop validation có thể được ignore hoặc thêm PropTypes
- Các view responsive và tương thích với cả mobile và web
