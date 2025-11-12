export const mockUsers = {
    "learner@example.com": {
        id: 1,
        name: "Learner User",
        email: "learner@example.com",
        role: "Learner",
        avatar:
            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=face",
        joinedDate: "2023-03-01",
        enrolledCourses: 5,
        completedCourses: 2,
        status: "available",
        password: "learner123",
    },
    "learner2@example.com": {
        id: 4,
        name: "John Smith",
        email: "learner2@example.com",
        role: "Learner",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        joinedDate: "2023-06-15",
        enrolledCourses: 3,
        completedCourses: 1,
        status: "available",
        password: "learner123",
    },
    "learner3@example.com": {
        id: 5,
        name: "Emma Wilson",
        email: "learner3@example.com",
        role: "Learner",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
        joinedDate: "2023-07-20",
        enrolledCourses: 4,
        completedCourses: 3,
        status: "available",
        password: "learner123",
    },
    "teacher@example.com": {
        id: 2,
        name: "Teacher User",
        email: "teacher@example.com",
        role: "Teacher",
        avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        joinedDate: "2023-04-01",
        coursesTaught: 3,
        students: 150,
        status: "available",
        password: "teacher123",
    },
    "admin@example.com": {
        id: 3,
        name: "Admin User",
        email: "admin@example.com",
        role: "Admin",
        avatar:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
        joinedDate: "2023-05-01",
        status: "available",
        password: "admin123",
    },
};


// In-memory data store
let dataStore = {
    users: mockUsers,
    // courses: mockCourses,
    // quizzes: mockQuizzes,
    // certificates: mockCertificates,
    // assignments: mockAssignments,
    // questionBank: mockQuestionBank,
    // enrollments: mockEnrollments || [],
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
        users: mockUsers,
        // courses: mockCourses,
        // quizzes: mockQuizzes,
        // certificates: mockCertificates,
        // assignments: mockAssignments,
        // questionBank: mockQuestionBank,
        // enrollments: mockEnrollments || [],
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
