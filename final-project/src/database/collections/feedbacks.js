export const mockFeedbacks = [
    {
        id: 1,
        userId: 1,
        userEmail: "learner@example.com",
        userName: "Learner User",
        courseId: 2,
        courseName: "Advanced JavaScript",
        rating: 5,
        comment:
            "Excellent course! The instructor explained complex concepts in a very clear way. I learned a lot about closures and async programming.",
        createdAt: "2025-10-31",
        updatedAt: "2025-10-31",
    },
    {
        id: 2,
        userId: 1,
        userEmail: "learner@example.com",
        userName: "Learner User",
        courseId: 11,
        courseName: "Digital Marketing Strategy",
        rating: 4,
        comment:
            "Great course covering all aspects of digital marketing. Would have liked more practical examples.",
        createdAt: "2025-09-16",
        updatedAt: "2025-09-16",
    },
    {
        id: 3,
        userId: 1,
        userEmail: "learner@example.com",
        userName: "Learner User",
        courseId: 1,
        courseName: "React Native Basics",
        rating: 5,
        comment:
            "Perfect for beginners! The hands-on projects really helped solidify my understanding of React Native.",
        date: "2025-10-15",
    },
    {
        id: 4,
        userId: 1,
        userEmail: "learner@example.com",
        userName: "Learner User",
        courseId: 7,
        courseName: "UI/UX Design Principles",
        rating: 4,
        comment:
            "Very informative course. The design thinking process was explained thoroughly. Still working through it but enjoying so far.",
        createdAt: "2025-10-20",
        updatedAt: "2025-11-02",
    },
    {
        id: 5,
        userId: 1,
        userEmail: "learner@example.com",
        userName: "Learner User",
        courseId: 15,
        courseName: "Public Speaking & Presentation Skills",
        rating: 5,
        comment:
            "This course is transforming my confidence! The exercises are practical and immediately applicable.",
        createdAt: "2025-10-25",
        updatedAt: "2025-10-25",
    },
    // Feedbacks from learner2@example.com
    {
        id: 6,
        userId: 4,
        userEmail: "learner2@example.com",
        userName: "John Smith",
        courseId: 3,
        courseName: "Python for Data Science",
        rating: 5,
        comment:
            "Outstanding content! Very comprehensive coverage of Python libraries for data science. Highly recommended!",
        createdAt: "2025-10-21",
        updatedAt: "2025-10-21",
    },
    {
        id: 7,
        userId: 4,
        userEmail: "learner2@example.com",
        userName: "John Smith",
        courseId: 4,
        courseName: "Web Development Bootcamp",
        rating: 5,
        comment:
            "Best bootcamp I've ever taken! The instructor is knowledgeable and the projects are real-world applicable.",
        createdAt: "2025-10-15",
        updatedAt: "2025-10-15",
    },
    {
        id: 8,
        userId: 4,
        userEmail: "learner2@example.com",
        userName: "John Smith",
        courseId: 8,
        courseName: "Graphic Design Masterclass",
        rating: 4,
        comment:
            "Great introduction to design tools. The Adobe suite tutorials are comprehensive.",
        createdAt: "2025-10-05",
        updatedAt: "2025-10-05",
    },
    // Feedbacks from learner3@example.com
    {
        id: 9,
        userId: 5,
        userEmail: "learner3@example.com",
        userName: "Emma Wilson",
        courseId: 5,
        courseName: "Mobile App Development with Flutter",
        rating: 5,
        comment:
            "Amazing course! I built 3 apps during this course and learned so much about cross-platform development.",
        createdAt: "2025-10-01",
        updatedAt: "2025-10-01",
    },
    {
        id: 10,
        userId: 5,
        userEmail: "learner3@example.com",
        userName: "Emma Wilson",
        courseId: 9,
        courseName: "3D Modeling with Blender",
        rating: 5,
        comment:
            "Incredible depth and quality! The instructor is a true expert in 3D modeling.",
        createdAt: "2025-10-16",
        updatedAt: "2025-10-16",
    },
    {
        id: 11,
        userId: 5,
        userEmail: "learner3@example.com",
        userName: "Emma Wilson",
        courseId: 12,
        courseName: "Project Management Professional",
        rating: 4,
        comment:
            "Very well structured course. Helped me prepare for my PMP certification exam.",
        createdAt: "2025-10-26",
        updatedAt: "2025-10-26",
    },
    {
        id: 12,
        userId: 5,
        userEmail: "learner3@example.com",
        userName: "Emma Wilson",
        courseId: 16,
        courseName: "Time Management & Productivity",
        rating: 5,
        comment:
            "Life-changing! My productivity has increased by at least 50% after applying these techniques.",
        createdAt: "2025-10-10",
        updatedAt: "2025-10-10",
    },
    // Additional feedback from teacher (as a learner perspective)
    {
        id: 13,
        userId: 2,
        userEmail: "teacher@example.com",
        userName: "Teacher User",
        courseId: 6,
        courseName: "Cybersecurity Fundamentals",
        rating: 5,
        comment:
            "Essential knowledge for everyone in tech. The security best practices section was particularly valuable.",
        createdAt: "2025-09-25",
        updatedAt: "2025-09-25",
    },
    {
        id: 14,
        userId: 2,
        userEmail: "teacher@example.com",
        userName: "Teacher User",
        courseId: 14,
        courseName: "Entrepreneurship & Startup",
        rating: 5,
        comment:
            "Fantastic insights into the startup world. The fundraising module was eye-opening.",
        createdAt: "2025-09-10",
        updatedAt: "2025-09-10",
    },
    {
        id: 15,
        userId: 2,
        userEmail: "teacher@example.com",
        userName: "Teacher User",
        courseId: 17,
        courseName: "Creative Writing Workshop",
        rating: 4,
        comment:
            "Great for improving storytelling skills. The peer review sessions were incredibly helpful.",
        createdAt: "2025-08-30",
        updatedAt: "2025-08-30",
    },
];


// In-memory data store
let dataStore = {
    // users: mockUsers,
    // courses: mockCourses,
    // quizzes: mockQuizzes,
    // certificates: mockCertificates,
    // assignments: mockAssignments,
    // questionBank: mockQuestionBank,
    // enrollments: mockEnrollments || [],
    // coupons: mockCoupons || [],
    // assignmentSubmissions: mockAssignmentSubmissions || [],
    feedbacks: mockFeedbacks,
};

// Load data from store
export function loadData() {
    return dataStore;
}

// Save data to store
export function saveData(data) {
    dataStore = { ...dataStore, ...data };
}

// Reset data to initial state
export function resetData() {
    dataStore = {
        // users: mockUsers,
        // courses: mockCourses,
        // quizzes: mockQuizzes,
        // certificates: mockCertificates,
        // assignments: mockAssignments,
        // questionBank: mockQuestionBank,
        // enrollments: mockEnrollments || [],
        // coupons: mockCoupons || [],
        // assignmentSubmissions: mockAssignmentSubmissions || [],
        feedbacks: mockFeedbacks,
    };
}

// Get specific collection
export function getCollection(collectionName) {
    return dataStore[collectionName] || [];
}

// Update specific collection
export function updateCollection(collectionName, data) {
    dataStore[collectionName] = data;
}
