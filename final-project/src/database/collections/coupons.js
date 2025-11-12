export const mockCoupons = [
    {
        id: "1",
        code: "WELCOME10",
        discount: 10,
        expiryDate: "2025-12-31",
        description: "Get 10% off on your first course purchase!",
        createdBy: "Admin User",
        createdAt: "2025-11-01",
    },
    {
        id: "2",
        code: "BLACKFRIDAY25",
        discount: 25,
        expiryDate: "2025-11-30",
        description: "Exclusive 25% discount for Black Friday!",
        createdBy: "Admin User",
        createdAt: "2025-11-05",
    },
    {
        id: "3",
        code: "LEARNMORE15",
        discount: 15,
        expiryDate: "2026-01-15",
        description: "15% discount for enrolling in multiple courses.",
        createdBy: "Admin User",
        createdAt: "2025-11-07",
    },
    {
        id: "4",
        code: "WELCOME50",
        discount: 10,
        expiryDate: "2025-12-31",
        description: "Get 10% off on your first course purchase!",
        createdBy: "Admin User",
        createdAt: "2025-11-01",
    },
    {
        id: "5",
        code: "BLACKFRIDAY65",
        discount: 25,
        expiryDate: "2025-11-30",
        description: "Exclusive 25% discount for Black Friday!",
        createdBy: "Admin User",
        createdAt: "2025-11-05",
    },
    {
        id: "6",
        code: "LEARNMORE55",
        discount: 15,
        expiryDate: "2026-01-15",
        description: "15% discount for enrolling in multiple courses.",
        createdBy: "Admin User",
        createdAt: "2025-11-07",
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
    coupons: mockCoupons || [],
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
        // enrollments: mockEnrollments || [],
        coupons: mockCoupons || [],
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
