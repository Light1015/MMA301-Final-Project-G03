export const mockEnrollments = [
    {
        id: 1,
        userId: 1,
        userEmail: "learner@example.com",
        courseId: 1,
        courseName: "React Native Basics",
        enrollDate: "2025-09-01",
        progress: 75,
        status: "in-progress", // enrolled, in-progress, completed
        lastAccessed: "2025-11-09",
    },
    {
        id: 2,
        userId: 1,
        userEmail: "learner@example.com",
        courseId: 2,
        courseName: "Advanced JavaScript",
        enrollDate: "2025-08-15",
        progress: 100,
        status: "completed",
        lastAccessed: "2025-10-30",
        completedDate: "2025-10-30",
    },
    // Removed old enrollments for courses 5, 7, 9 (no assignments)
    // Only keep courses with assignments (1, 2)

    // Enrollments for learner2@example.com
    {
        id: 6,
        userId: 4,
        userEmail: "learner2@example.com",
        courseId: 3,
        courseName: "Python for Data Science",
        enrollDate: "2025-08-01",
        progress: 100,
        status: "completed",
        lastAccessed: "2025-10-20",
        completedDate: "2025-10-20",
    },
    {
        id: 7,
        userId: 4,
        userEmail: "learner2@example.com",
        courseId: 4,
        courseName: "Web Development Bootcamp",
        enrollDate: "2025-09-10",
        progress: 60,
        status: "in-progress",
        lastAccessed: "2025-11-09",
    },
    {
        id: 8,
        userId: 4,
        userEmail: "learner2@example.com",
        courseId: 8,
        courseName: "Graphic Design Masterclass",
        enrollDate: "2025-09-25",
        progress: 25,
        status: "in-progress",
        lastAccessed: "2025-11-06",
    },
    // Enrollments for learner3@example.com
    {
        id: 9,
        userId: 5,
        userEmail: "learner3@example.com",
        courseId: 5,
        courseName: "Mobile App Development with Flutter",
        enrollDate: "2025-07-15",
        progress: 100,
        status: "completed",
        lastAccessed: "2025-09-30",
        completedDate: "2025-09-30",
    },
    {
        id: 10,
        userId: 5,
        userEmail: "learner3@example.com",
        courseId: 9,
        courseName: "3D Modeling with Blender",
        enrollDate: "2025-08-01",
        progress: 100,
        status: "completed",
        lastAccessed: "2025-10-15",
        completedDate: "2025-10-15",
    },
    {
        id: 11,
        userId: 5,
        userEmail: "learner3@example.com",
        courseId: 12,
        courseName: "Project Management Professional",
        enrollDate: "2025-08-20",
        progress: 100,
        status: "completed",
        lastAccessed: "2025-10-25",
        completedDate: "2025-10-25",
    },
    {
        id: 12,
        userId: 5,
        userEmail: "learner3@example.com",
        courseId: 16,
        courseName: "Time Management & Productivity",
        enrollDate: "2025-10-01",
        progress: 85,
        status: "in-progress",
        lastAccessed: "2025-11-08",
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
    enrollments: mockEnrollments || [],
    // coupons: mockCoupons || [],
    // assignmentSubmissions: mockAssignmentSubmissions || [],
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
        enrollments: mockEnrollments || [],
        // coupons: mockCoupons || [],
        // assignmentSubmissions: mockAssignmentSubmissions || [],
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
