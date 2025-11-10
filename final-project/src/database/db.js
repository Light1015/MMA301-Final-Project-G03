// Database mock data for Eduling Go app

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
};

export const mockCourses = [
  // Programming Courses
  {
    id: 1,
    title: "React Native Basics",
    instructor: "Teacher User",
    description:
      "Learn the fundamentals of React Native development. Build mobile apps for iOS and Android using JavaScript and React.",
    duration: "4 weeks",
    students: 120,
    rating: 4.5,
    category: "Programming",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    instructor: "Teacher User",
    description:
      "Deep dive into advanced JavaScript concepts including closures, promises, async/await, and ES6+ features.",
    duration: "6 weeks",
    students: 85,
    rating: 4.7,
    category: "Programming",
    level: "Advanced",
    image:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=500&fit=crop",
  },
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Teacher User",
    description:
      "Master Python programming for data analysis, visualization, and machine learning applications.",
    duration: "8 weeks",
    students: 210,
    rating: 4.8,
    category: "Programming",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=500&fit=crop",
  },
  {
    id: 4,
    title: "Web Development Bootcamp",
    instructor: "Teacher User",
    description:
      "Complete full-stack web development course covering HTML, CSS, JavaScript, Node.js, and React.",
    duration: "12 weeks",
    students: 340,
    rating: 4.9,
    category: "Programming",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
  },
  {
    id: 5,
    title: "Mobile App Development with Flutter",
    instructor: "Teacher User",
    description:
      "Build beautiful, natively compiled applications for mobile from a single codebase using Flutter and Dart.",
    duration: "7 weeks",
    students: 156,
    rating: 4.6,
    category: "Programming",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop",
  },
  {
    id: 6,
    title: "Cybersecurity Fundamentals",
    instructor: "Teacher User",
    description:
      "Learn the basics of cybersecurity, network security, cryptography, and ethical hacking techniques.",
    duration: "6 weeks",
    students: 178,
    rating: 4.7,
    category: "Programming",
    level: "Advanced",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop",
  },

  // Design Courses
  {
    id: 7,
    title: "UI/UX Design Principles",
    instructor: "Teacher User",
    description:
      "Master the art of user interface and experience design. Learn design thinking, wireframing, and prototyping.",
    duration: "5 weeks",
    students: 95,
    rating: 4.6,
    category: "Design",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
  },
  {
    id: 8,
    title: "Graphic Design Masterclass",
    instructor: "Teacher User",
    description:
      "Learn Adobe Photoshop, Illustrator, and InDesign. Create stunning graphics, logos, and brand identities.",
    duration: "10 weeks",
    students: 267,
    rating: 4.8,
    category: "Design",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=500&fit=crop",
  },
  {
    id: 9,
    title: "3D Modeling with Blender",
    instructor: "Teacher User",
    description:
      "Create professional 3D models, animations, and visual effects using Blender from scratch.",
    duration: "9 weeks",
    students: 143,
    rating: 4.7,
    category: "Design",
    level: "Advanced",
    image:
      "https://images.unsplash.com/photo-1633217065214-7f88a45f4486?w=800&h=500&fit=crop",
  },
  {
    id: 10,
    title: "Motion Graphics & Animation",
    instructor: "Teacher User",
    description:
      "Master After Effects and create stunning motion graphics, animations, and visual storytelling.",
    duration: "7 weeks",
    students: 189,
    rating: 4.9,
    category: "Design",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=500&fit=crop",
  },

  // Business Courses
  {
    id: 11,
    title: "Digital Marketing Strategy",
    instructor: "Teacher User",
    description:
      "Master digital marketing including SEO, SEM, social media marketing, and content marketing strategies.",
    duration: "6 weeks",
    students: 312,
    rating: 4.7,
    category: "Business",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
  },
  {
    id: 12,
    title: "Project Management Professional",
    instructor: "Teacher User",
    description:
      "Learn project management methodologies, Agile, Scrum, and prepare for PMP certification.",
    duration: "8 weeks",
    students: 245,
    rating: 4.8,
    category: "Business",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
  },
  {
    id: 13,
    title: "Financial Analysis & Investment",
    instructor: "Teacher User",
    description:
      "Understanding financial statements, valuation techniques, and investment strategies for smart decision-making.",
    duration: "7 weeks",
    students: 198,
    rating: 4.6,
    category: "Business",
    level: "Advanced",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop",
  },
  {
    id: 14,
    title: "Entrepreneurship & Startup",
    instructor: "Teacher User",
    description:
      "Learn how to start, grow, and scale your own business. From idea validation to fundraising and growth hacking.",
    duration: "10 weeks",
    students: 428,
    rating: 4.9,
    category: "Business",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=500&fit=crop",
  },

  // General Courses
  {
    id: 15,
    title: "Public Speaking & Presentation Skills",
    instructor: "Teacher User",
    description:
      "Overcome stage fright and deliver powerful, confident presentations that captivate your audience.",
    duration: "4 weeks",
    students: 276,
    rating: 4.7,
    category: "General",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop",
  },
  {
    id: 16,
    title: "Time Management & Productivity",
    instructor: "Teacher User",
    description:
      "Master time management techniques, productivity hacks, and work-life balance strategies.",
    duration: "3 weeks",
    students: 389,
    rating: 4.8,
    category: "General",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop",
  },
  {
    id: 17,
    title: "Creative Writing Workshop",
    instructor: "Teacher User",
    description:
      "Develop your storytelling skills, learn narrative techniques, and write compelling fiction or non-fiction.",
    duration: "6 weeks",
    students: 164,
    rating: 4.6,
    category: "General",
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop",
  },
  {
    id: 18,
    title: "Photography Fundamentals",
    instructor: "Teacher User",
    description:
      "Learn camera settings, composition, lighting, and photo editing to capture stunning images.",
    duration: "5 weeks",
    students: 223,
    rating: 4.7,
    category: "General",
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=500&fit=crop",
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
    certificateName: "React Native Developer",
    courseId: 1,
    courseName: "React Native Basics",
    description: "Certificate for completing React Native Basics course",
    issueDate: "2025-11-01",
    validityPeriod: "1 year",
    templateDesign: "default",
    status: "active",
  },
  {
    id: 2,
    certificateName: "JavaScript Expert",
    courseId: 2,
    courseName: "Advanced JavaScript",
    description: "Certificate for completing Advanced JavaScript course",
    issueDate: "2025-10-15",
    validityPeriod: "2 years",
    templateDesign: "premium",
    status: "active",
  },
  {
    id: 3,
    certificateName: "UX Designer",
    courseId: 3,
    courseName: "UI/UX Design Principles",
    description: "Certificate for completing UI/UX Design course",
    issueDate: "2025-09-20",
    validityPeriod: "Lifetime",
    templateDesign: "default",
    status: "inactive",
  },
];
