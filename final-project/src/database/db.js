// Database mock data for Eduling Go app

export const mockUsers = {
  'guest@example.com': {
    id: 1,
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'Guest',
    avatar: 'https://via.placeholder.com/100x100.png?text=G',
    joinedDate: '2023-01-01',
  },
  'interviewer@example.com': {
    id: 2,
    name: 'Interviewer User',
    email: 'interviewer@example.com',
    role: 'Interviewer',
    avatar: 'https://via.placeholder.com/100x100.png?text=I',
    joinedDate: '2023-02-01',
  },
  'learner@example.com': {
    id: 3,
    name: 'Learner User',
    email: 'learner@example.com',
    role: 'Homepage Learner',
    avatar: 'https://via.placeholder.com/100x100.png?text=L',
    joinedDate: '2023-03-01',
    enrolledCourses: 5,
    completedCourses: 2,
  },
  'teacher@example.com': {
    id: 4,
    name: 'Teacher User',
    email: 'teacher@example.com',
    role: 'Teacher',
    avatar: 'https://via.placeholder.com/100x100.png?text=T',
    joinedDate: '2023-04-01',
    coursesTaught: 3,
    students: 150,
  },
  'admin@example.com': {
    id: 5,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    avatar: 'https://via.placeholder.com/100x100.png?text=A',
    joinedDate: '2023-05-01',
  },
};

export const mockCourses = [
  {
    id: 1,
    title: 'React Native Basics',
    instructor: 'Teacher User',
    description: 'Learn the fundamentals of React Native development.',
    duration: '4 weeks',
    students: 120,
    rating: 4.5,
    image: 'https://via.placeholder.com/300x200.png?text=RN',
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    instructor: 'Teacher User',
    description: 'Deep dive into advanced JavaScript concepts.',
    duration: '6 weeks',
    students: 85,
    rating: 4.7,
    image: 'https://via.placeholder.com/300x200.png?text=JS',
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    instructor: 'Teacher User',
    description: 'Master the art of user interface and experience design.',
    duration: '5 weeks',
    students: 95,
    rating: 4.6,
    image: 'https://via.placeholder.com/300x200.png?text=UX',
  },
];

export const mockAnnouncements = [
  {
    id: 1,
    title: 'New Course Available',
    content: 'Check out our latest React Native course!',
    date: '2025-11-01',
    author: 'Admin User',
  },
  {
    id: 2,
    title: 'System Maintenance',
    content: 'Scheduled maintenance on Nov 5th, 2-4 AM.',
    date: '2025-10-30',
    author: 'Admin User',
  },
];

export const mockAssignments = [
  {
    id: 1,
    title: 'Build a Simple App',
    course: 'React Native Basics',
    dueDate: '2025-11-10',
    status: 'pending',
  },
  {
    id: 2,
    title: 'JavaScript Quiz',
    course: 'Advanced JavaScript',
    dueDate: '2025-11-05',
    status: 'completed',
  },
];

// Default password for all mock users
export const DEFAULT_PASSWORD = 'password123';