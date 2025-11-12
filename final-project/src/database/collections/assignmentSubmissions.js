// Mock Assignment Submissions - Learner submissions for assignments
export const mockAssignmentSubmissions = [];

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
    assignmentSubmissions: mockAssignmentSubmissions || [],
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
        assignmentSubmissions: mockAssignmentSubmissions || [],
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
