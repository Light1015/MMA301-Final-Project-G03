# Assignment Management System

## Overview
Assignment Management System đã được tích hợp vào Eduling Go, thay thế Student Progress. Hệ thống cho phép giáo viên tạo bài kiểm tra (assignments) từ các câu hỏi có sẵn trong Quiz Bank.

## Kiến trúc

### 1. **Model: AssignmentModel.js**
Quản lý dữ liệu assignments với các tính năng:
- CRUD operations (Create, Read, Update, Delete)
- Filter by instructor/course
- Add/remove questions
- Update status (draft, published, closed)
- Statistics tracking

### 2. **Controller: AssignmentController.js**
Xử lý business logic:
- Validation và authorization
- Data persistence
- Error handling
- Integration với database

### 3. **Views**

#### **AssignmentListView.js**
- Hiển thị danh sách assignments dạng table
- Search và sort functionality
- Pagination (8 items/page)
- Create/Edit/Delete assignments
- Status badges (Draft, Published, Closed)
- Course selector khi tạo assignment

#### **DetailAssignmentView.js**
- Quản lý questions trong assignment
- Info bar hiển thị: Course, Due Date, Status
- Quick status toggle buttons
- Table hiển thị questions với columns:
  - Question text
  - Options (A/B/C/D)
  - Correct Answer
  - Points
  - Actions (Delete)

### 4. **Question Selection Modal**
Hỗ trợ 3 cách thêm questions:
1. **Add whole quiz**: Chọn toàn bộ quiz → thêm tất cả questions
2. **Add individual questions**: Expand quiz → chọn từng câu
3. **Search**: Filter quizzes theo tên/course

## Data Schema

### Assignment Object
```javascript
{
  id: number,
  title: string,
  instructor: string,
  courseId: number,
  courseName: string,
  description: string,
  dueDate: string, // "YYYY-MM-DD"
  totalPoints: number,
  status: "draft" | "published" | "closed",
  questions: [
    {
      id: number,
      questionText: string,
      options: { A, B, C, D },
      correctAnswer: "A" | "B" | "C" | "D",
      points: number,
      sourceQuizId: number,
      sourceQuestionId: number
    }
  ],
  createdAt: string,
  updatedAt: string
}
```

## Navigation Flow

```
Teacher Dashboard
    ↓
Assignment Management (Card với icon document-text)
    ↓
AssignmentListView (Table với search/sort/pagination)
    ↓
    ├─→ Create Assignment (Modal)
    │   └─→ Select Course → Save
    │
    ├─→ Edit Assignment (Modal)
    │   └─→ Update fields → Save
    │
    └─→ View Detail (DetailAssignmentView)
        ├─→ Add Questions (Modal)
        │   ├─→ Add whole quiz
        │   └─→ Add individual questions
        │
        ├─→ Delete questions
        │
        └─→ Change status (draft/published/closed)
```

## Features

### 1. **Assignment CRUD**
- ✅ Create assignment với title, course, description, due date
- ✅ Edit assignment details
- ✅ Delete assignment (với confirmation)
- ✅ View assignment detail

### 2. **Question Management**
- ✅ Add questions từ quiz bank
- ✅ Add toàn bộ quiz
- ✅ Add từng câu hỏi riêng lẻ
- ✅ Remove questions khỏi assignment
- ✅ Track source quiz/question

### 3. **Status Management**
- ✅ Draft: Đang soạn thảo
- ✅ Published: Đã xuất bản (students có thể làm)
- ✅ Closed: Đã đóng (hết hạn)
- ✅ Quick toggle status trong detail view

### 4. **Search & Filter**
- ✅ Search by assignment name/course
- ✅ Sort by newest/oldest
- ✅ Filter quizzes khi chọn questions

### 5. **UI/UX**
- ✅ Table layout giống Quiz Management
- ✅ Pagination với 8 items/page
- ✅ Status badges với màu sắc phân biệt
- ✅ Responsive modal forms
- ✅ Icon buttons cho actions
- ✅ Empty states

## Mock Data

### Sample Assignments (3 assignments)
1. **JavaScript Midterm Exam**
   - Course: Advanced JavaScript
   - Status: Published
   - 5 questions (50 points)

2. **React Native Final Project**
   - Course: React Native Basics
   - Status: Published
   - 5 questions (75 points)

3. **Python Quiz 1**
   - Course: Python for Data Science
   - Status: Draft
   - 3 questions (30 points)

## Integration Points

### Teacher Dashboard
```javascript
<TouchableOpacity
  style={styles.card}
  onPress={onNavigateToAssignmentManagement}
>
  <Ionicons name="document-text" size={40} color="#F59E0B" />
  <Text>Assignment Management</Text>
</TouchableOpacity>
```

### App.js Routing
```javascript
{currentView === "assignmentManagement" && (
  <AssignmentListView 
    user={user} 
    onBack={() => setCurrentView("home")} 
  />
)}
```

## Styling

### Color Scheme
- **Primary**: #4F46E5 (Indigo)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Danger**: #EF4444 (Red)
- **Gray**: #6B7280

### Status Colors
- **Draft**: #6B7280 (Gray)
- **Published**: #10B981 (Green)
- **Closed**: #EF4444 (Red)

## Database Functions

```javascript
// Load data from in-memory store
export function loadData() {
  return dataStore; // Contains assignments, quizzes, etc.
}

// Save data to in-memory store
export function saveData(data) {
  dataStore = { ...dataStore, ...data };
}
```

## Future Enhancements

### Planned Features
1. **Student View**: Students làm bài assignment
2. **Grading System**: Tự động chấm điểm
3. **Submissions**: Theo dõi bài nộp
4. **Analytics**: Thống kê kết quả
5. **Time Limit**: Giới hạn thời gian làm bài
6. **Randomize**: Xáo trộn câu hỏi/đáp án
7. **Partial Credit**: Điểm từng phần
8. **Feedback**: Giải thích đáp án

### Technical Improvements
1. **Persistence**: Save to AsyncStorage/Database
2. **Real-time Updates**: WebSocket for live changes
3. **Export**: PDF/Excel reports
4. **Import**: Bulk import questions
5. **Templates**: Assignment templates
6. **Duplicate**: Clone existing assignments

## Testing Checklist

- [x] Create assignment with valid data
- [x] Create assignment with invalid data (validation)
- [x] Edit assignment details
- [x] Delete assignment with confirmation
- [x] Add whole quiz to assignment
- [x] Add individual questions
- [x] Remove questions from assignment
- [x] Change assignment status
- [x] Search assignments
- [x] Sort by date
- [x] Pagination navigation
- [x] Empty state display
- [x] Back navigation
- [x] Modal open/close
- [x] Course selector
- [x] Authorization check (instructor ownership)

## Conclusion

Assignment Management System đã hoàn thành với đầy đủ tính năng CRUD, question selection từ quiz bank, và UI/UX nhất quán với hệ thống Quiz Management. System sẵn sàng để mở rộng thêm các tính năng student submission và grading.
