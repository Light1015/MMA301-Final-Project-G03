// Database mock data for Eduling Go app
//
// ============================================
// ACCOUNT LOGIN INFORMATION:
// ============================================
// Learner Account:
//   Email: learner@example.com
//   Password: learner123
//
// Teacher Account:
//   Email: teacher@example.com
//   Password: teacher123
//
// Admin Account:
//   Email: admin@example.com
//   Password: admin123
// ============================================

export const mockUsers = {
  "learner@example.com": {
    id: 1,
    name: "Learner User",
    email: "learner@example.com",
    role: "Learner",
    avatar: "https://via.placeholder.com/100x100.png?text=L",
    joinedDate: "2023-03-01",
    enrolledCourses: 5,
    completedCourses: 2,
    status: "available",
    password: "learner123", // Password riêng cho learner
  },
  "teacher@example.com": {
    id: 2,
    name: "Teacher User",
    email: "teacher@example.com",
    role: "Teacher",
    avatar: "https://via.placeholder.com/100x100.png?text=T",
    joinedDate: "2023-04-01",
    coursesTaught: 3,
    students: 150,
    status: "available",
    password: "teacher123", // Password riêng cho teacher
  },
  "admin@example.com": {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    avatar: "https://via.placeholder.com/100x100.png?text=A",
    joinedDate: "2023-05-01",
    status: "available",
    password: "admin123", // Password riêng cho admin
  },
  "gv@gmail.com": {
    id: 4,
    name: "Teacher",
    email: "gv@gmail.com",
    role: "Teacher",
    avatar: "https://via.placeholder.com/100x100.png?text=L",
    joinedDate: "2023-03-01",
    enrolledCourses: 6,
    completedCourses: 6,
    status: "available",
    password: "123456", // Password riêng cho learner
  },
};

export const mockCourses = [
  {
    id: 1,
    title: "React Native Basics",
    instructor: "Teacher User",
    description: "Learn the fundamentals of React Native development.",
    duration: "4 weeks",
    students: 120,
    rating: 4.5,
    image: "https://via.placeholder.com/300x200.png?text=RN",
    category: "Programming",
    level: "Beginner",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    instructor: "Teacher User",
    description: "Deep dive into advanced JavaScript concepts.",
    duration: "6 weeks",
    students: 85,
    rating: 4.7,
    image: "https://via.placeholder.com/300x200.png?text=JS",
    category: "Programming",
    level: "Advanced",
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-02-10T10:00:00Z",
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    instructor: "Teacher User",
    description: "Master the art of user interface and experience design.",
    duration: "5 weeks",
    students: 95,
    rating: 4.6,
    image: "https://via.placeholder.com/300x200.png?text=UX",
    category: "Design",
    level: "Intermediate",
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-03-05T10:00:00Z",
  },
  {
    id: 4,
    title: "Digital Marketing Fundamentals",
    instructor: "Teacher User",
    description:
      "Learn the basics of digital marketing and social media strategies.",
    duration: "3 weeks",
    students: 65,
    rating: 4.4,
    image: "https://via.placeholder.com/300x200.png?text=Marketing",
    category: "Business",
    level: "Beginner",
    createdAt: "2024-04-20T10:00:00Z",
    updatedAt: "2024-04-20T10:00:00Z",
  },
  {
    id: 5,
    title: "Photography Basics",
    instructor: "Teacher User",
    description: "Discover the fundamentals of photography and composition.",
    duration: "4 weeks",
    students: 50,
    rating: 4.8,
    image: "https://via.placeholder.com/300x200.png?text=Photo",
    category: "Arts",
    level: "Beginner",
    createdAt: "2024-05-10T10:00:00Z",
    updatedAt: "2024-05-10T10:00:00Z",
  },
  {
    id: 6,
    title: "Cooking Masterclass",
    instructor: "Teacher User",
    description: "Learn professional cooking techniques and recipes.",
    duration: "6 weeks",
    students: 75,
    rating: 4.9,
    image: "https://via.placeholder.com/300x200.png?text=Cooking",
    category: "Lifestyle",
    level: "Intermediate",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
];

export const mockAnnouncements = [
  {
    id: 1,
    title: "New Course Available",
    content: "Check out our latest React Native course!",
    date: "2025-11-01",
    author: "Admin User",
  },
  {
    id: 2,
    title: "System Maintenance",
    content: "Scheduled maintenance on Nov 5th, 2-4 AM.",
    date: "2025-10-30",
    author: "Admin User",
  },
];

export const mockAssignments = [
  {
    id: 1,
    title: "Build a Simple App",
    course: "React Native Basics",
    dueDate: "2025-11-10",
    status: "pending",
  },
  {
    id: 2,
    title: "JavaScript Quiz",
    course: "Advanced JavaScript",
    dueDate: "2025-11-05",
    status: "completed",
  },
];
export const mockCertificates = [
  {
    id: 1,
    certificateName: 'React Native Developer',
    courseId: 1,
    courseName: 'React Native Basics',
    description: 'Certificate for completing React Native Basics course',
    issueDate: '2025-11-01',
    validityPeriod: '1 year',
    templateDesign: 'default',
    status: 'active',
  },
  {
    id: 2,
    certificateName: 'JavaScript Expert',
    courseId: 2,
    courseName: 'Advanced JavaScript',
    description: 'Certificate for completing Advanced JavaScript course',
    issueDate: '2025-10-15',
    validityPeriod: '2 years',
    templateDesign: 'premium',
    status: 'active',
  },
  {
    id: 3,
    certificateName: 'UX Designer',
    courseId: 3,
    courseName: 'UI/UX Design Principles',
    description: 'Certificate for completing UI/UX Design course',
    issueDate: '2025-09-20',
    validityPeriod: 'Lifetime',
    templateDesign: 'default',
    status: 'inactive',
  },
];

// Helper function to get next available ID
export const getNextUserId = () => {
  const users = Object.values(mockUsers);
  if (users.length === 0) return 1;
  const maxId = Math.max(...users.map((u) => u.id));
  return maxId + 1;
};
