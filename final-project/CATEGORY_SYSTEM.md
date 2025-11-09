# Category System - Course Management

## 📚 Cách Hoạt Động của Category System

### Các Category Chính

Hệ thống có **4 categories** để phân loại khóa học:

1. **Programming** - Các khóa học lập trình
2. **Design** - Các khóa học thiết kế
3. **Business** - Các khóa học kinh doanh
4. **General** - Các khóa học khác (không thuộc 3 loại trên)

### Logic Phân Loại

#### Khi Tạo/Cập Nhật Course:

```javascript
// Trong CourseModel.js
const validCategories = ["Programming", "Design", "Business"];

// Nếu category không phải là một trong 3 loại trên
if (!validCategories.includes(category)) {
  category = "General"; // Tự động chuyển thành General
}
```

**Ví dụ:**

- Tạo course với category = "Programming" → Lưu là "Programming" ✅
- Tạo course với category = "Arts" → Tự động lưu là "General" ✅
- Tạo course với category = "Cooking" → Tự động lưu là "General" ✅
- Tạo course với category = "" (empty) → Lưu là "General" ✅

#### Khi Filter trong Course Catalog:

```javascript
// Trong CourseCatalogView.js
if (selectedCategory === "General") {
  // Lọc các course KHÔNG thuộc Programming, Design, Business
  filtered = filtered.filter((course) => {
    const category = course.category || "General";
    return !["Programming", "Design", "Business"].includes(category);
  });
}
```

**Kết quả filter:**

- Filter "Programming" → Hiển thị chỉ courses có category = "Programming"
- Filter "Design" → Hiển thị chỉ courses có category = "Design"
- Filter "Business" → Hiển thị chỉ courses có category = "Business"
- Filter "General" → Hiển thị TẤT CẢ courses có category khác (Arts, Lifestyle, Music, Sport, v.v...)
- Filter "All" → Hiển thị tất cả courses

### UI trong Form

Khi tạo hoặc edit course, Teacher sẽ thấy 4 nút:

```
┌─────────────┬─────────┬──────────┬─────────┐
│ Programming │ Design  │ Business │ General │
└─────────────┴─────────┴──────────┴─────────┘
```

- Chọn Programming/Design/Business: Lưu đúng category đó
- Chọn General: Lưu là "General" (dùng cho các course không thuộc 3 loại chính)

**Helper text:**

> "Note: Select one of the main categories. 'General' is for other courses."

### Ví Dụ Thực Tế

#### Database có các courses sau:

```javascript
[
  { id: 1, title: "React Native", category: "Programming" },
  { id: 2, title: "JavaScript", category: "Programming" },
  { id: 3, title: "UI/UX Design", category: "Design" },
  { id: 4, title: "Digital Marketing", category: "Business" },
  { id: 5, title: "Photography", category: "Arts" }, // → General
  { id: 6, title: "Cooking", category: "Lifestyle" }, // → General
];
```

#### Kết quả khi filter:

**Filter = "All":**

- Hiển thị: 6 courses (tất cả)

**Filter = "Programming":**

- Hiển thị: React Native, JavaScript (2 courses)

**Filter = "Design":**

- Hiển thị: UI/UX Design (1 course)

**Filter = "Business":**

- Hiển thị: Digital Marketing (1 course)

**Filter = "General":**

- Hiển thị: Photography, Cooking (2 courses)
- Vì "Arts" và "Lifestyle" không thuộc 3 loại chính

### Lợi Ích của Thiết Kế Này

✅ **Tính mở rộng**: Có thể thêm bất kỳ category nào (Arts, Music, Sport, Health...) và chúng tự động thuộc "General"

✅ **Đơn giản**: Chỉ cần maintain 3 category chính, còn lại để General

✅ **Linh hoạt**: Teacher có thể tạo course với bất kỳ chủ đề nào

✅ **Dễ filter**: User có thể filter theo 3 category chính, hoặc xem tất cả "other" trong General

### Code Flow

```
1. Teacher tạo course → Nhập "Arts" làm category
                      ↓
2. CourseModel.createCourse() → Validate category
                      ↓
3. "Arts" không thuộc [Programming, Design, Business]
                      ↓
4. Tự động set category = "General"
                      ↓
5. Lưu vào database với category = "General"
                      ↓
6. Khi filter "General" → Course này sẽ hiển thị
```

### Migration & Backward Compatibility

Nếu có course cũ trong database:

- Có category = "Programming/Design/Business" → Giữ nguyên ✅
- Có category khác → Hiển thị trong filter "General" ✅
- Không có category (null/undefined) → Coi như "General" ✅

### Testing Checklist

- [ ] Tạo course với category "Programming" → Lưu đúng
- [ ] Tạo course với category "Arts" → Lưu là "General"
- [ ] Filter "Programming" → Chỉ hiển thị Programming courses
- [ ] Filter "General" → Hiển thị tất cả courses không phải 3 loại chính
- [ ] Edit course từ "Programming" → "General" → Lưu đúng
- [ ] Edit course từ "General" → "Design" → Lưu đúng

### Tương Lai

Có thể mở rộng thành:

```javascript
const mainCategories = {
  'Programming': ['Web Dev', 'Mobile Dev', 'Backend'],
  'Design': ['UI/UX', 'Graphic Design', 'Motion Graphics'],
  'Business': ['Marketing', 'Finance', 'Entrepreneurship'],
  'General': ['Arts', 'Music', 'Lifestyle', 'Health', ...]
};
```

Nhưng hiện tại giữ đơn giản với 4 categories chính.
