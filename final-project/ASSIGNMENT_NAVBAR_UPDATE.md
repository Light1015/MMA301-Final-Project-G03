# Assignment Management - Bottom Navbar & Dashboard Stats Update

## Thay đổi đã thực hiện

### 1. **Bottom Navbar Integration (HomeView.js)**

#### Thêm props cho BottomNavbar
```javascript
const BottomNavbar = ({
  role,
  onNavigateToUserManagement,
  onNavigateToAssignmentManagement, // NEW
  activeTab,
  setActiveTab,
}) => {
```

#### Thêm action cho Teacher's Assignments tab
```javascript
Teacher: [
  { id: "home", name: "Home", icon: "home-outline", iconActive: "home" },
  {
    id: "classes",
    name: "Classes",
    icon: "people-outline",
    iconActive: "people",
  },
  {
    id: "assignments",
    name: "Assignments",
    icon: "document-outline",
    iconActive: "document",
    action: onNavigateToAssignmentManagement, // NEW - Khi bấm sẽ navigate
  },
  {
    id: "students",
    name: "Students",
    icon: "person-outline",
    iconActive: "person",
  },
],
```

#### Pass props khi render BottomNavbar
```javascript
<BottomNavbar
  role={user.role}
  onNavigateToUserManagement={onNavigateToUserManagement}
  onNavigateToAssignmentManagement={onNavigateToAssignmentManagement} // NEW
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>
```

### 2. **Dashboard Statistics (TeacherDashboard.js)**

#### Import AssignmentController
```javascript
import AssignmentController from "../../controllers/AssignmentController";
```

#### Thêm totalAssignments vào state
```javascript
const [stats, setStats] = useState({
  totalCourses: 0,
  totalStudents: 0,
  totalAssignments: 0, // NEW
});
```

#### Load assignments count từ controller
```javascript
const loadStats = () => {
  // Get teacher's courses
  const coursesResult = CourseController.getTeacherCourses(user.name);
  let totalCourses = 0;
  let totalStudents = 0;
  
  if (coursesResult.success) {
    const courses = coursesResult.data;
    totalCourses = courses.length;
    totalStudents = courses.reduce(
      (sum, course) => sum + (course.students || 0),
      0
    );
  }

  // Get teacher's assignments - NEW
  const assignmentsResult = AssignmentController.getTeacherAssignments(user.name);
  let totalAssignments = 0;
  
  if (assignmentsResult.success) {
    totalAssignments = assignmentsResult.data.length;
  }

  setStats({
    totalCourses,
    totalStudents,
    totalAssignments, // NEW
  });
};
```

#### Hiển thị số assignments thực tế
```javascript
<View style={styles.statCard}>
  <Ionicons name="document-text" size={30} color="#F59E0B" />
  <Text style={styles.statNumber}>{stats.totalAssignments}</Text> {/* Thay vì hardcode "12" */}
  <Text style={styles.statLabel}>Assignments</Text>
</View>
```

### 3. **App.js Import**

#### Thêm import AssignmentListView
```javascript
import AssignmentListView from "./src/views/assignments/AssignmentListView";
```

## Kết quả

### ✅ Bottom Navbar
- **Teacher role** có tab "Assignments" với icon `document-outline`
- Khi bấm vào → Navigate đến Assignment Management
- Icon active state: `document`

### ✅ Dashboard Stats
- Hiển thị số lượng assignments **thực tế** của teacher
- Real-time update khi có thay đổi
- Icon: `document-text` màu #F59E0B (Amber)

### ✅ Navigation Flow
```
Teacher Bottom Navbar
    ↓
Click "Assignments" tab
    ↓
AssignmentListView
    ↓
Create/Edit/View Assignments
    ↓
DetailAssignmentView
```

## Test Cases

- [x] Bottom navbar hiển thị đúng cho Teacher role
- [x] Click "Assignments" tab navigate đúng
- [x] Dashboard stats hiển thị số assignments
- [x] Stats update khi tạo/xóa assignment
- [x] Icon hiển thị đúng (outline khi inactive, filled khi active)
- [x] No compilation errors
- [x] All imports resolved correctly

## Màu sắc & Icons

### Stats Card
- **Icon**: `document-text`
- **Color**: #F59E0B (Amber/Orange)
- **Size**: 30

### Bottom Navbar
- **Icon Inactive**: `document-outline`
- **Icon Active**: `document`
- **Color**: Theo theme (active: primary blue)

## Files Modified

1. ✅ `src/views/HomeView.js`
   - Added `onNavigateToAssignmentManagement` prop to BottomNavbar
   - Added action to Teacher's assignments tab
   - Pass prop when rendering BottomNavbar

2. ✅ `src/views/dashboards/TeacherDashboard.js`
   - Import AssignmentController
   - Added totalAssignments to stats state
   - Load assignments count in loadStats()
   - Display real count instead of hardcoded value
   - Changed icon to `document-text`

3. ✅ `App.js`
   - Import AssignmentListView component

## Dependencies

- ✅ AssignmentController.getTeacherAssignments(instructorName)
- ✅ QuizController.getTeacherQuizzes(instructorName)
- ✅ All models and controllers properly initialized

Hoàn thành! Assignment Management giờ đã có 3 cách truy cập:
1. **Dashboard Card** - Click "Assignment Management" card
2. **Bottom Navbar** - Click "Assignments" tab (Teacher role)
3. **Direct Navigation** - From App.js routing
