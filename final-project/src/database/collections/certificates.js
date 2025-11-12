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


// In-memory data store
let dataStore = {
    // users: mockUsers,
    // courses: mockCourses,
    // quizzes: mockQuizzes,
    certificates: mockCertificates,
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
        // users: mockUsers,
        // courses: mockCourses,
        // quizzes: mockQuizzes,
        certificates: mockCertificates,
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
