export const mockAssignments = [
    // ====== Advanced JavaScript ======
    {
        id: 1,
        title: "JavaScript Midterm Exam",
        instructor: "Teacher User",
        courseId: 2,
        courseName: "Advanced JavaScript",
        description:
            "Comprehensive test covering JavaScript fundamentals and advanced concepts",
        dueDate: "2025-11-20",
        totalPoints: 100,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is a closure in JavaScript?",
                options: {
                    A: "A function that has access to variables in its outer scope",
                    B: "A loop structure",
                    C: "A data type",
                    D: "A CSS property",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 2,
                questionText: "What does async/await do?",
                options: {
                    A: "Handles asynchronous operations",
                    B: "Creates animations",
                    C: "Manages state",
                    D: "Styles components",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 3,
                questionText: "What is hoisting?",
                options: {
                    A: "Moving declarations to top",
                    B: "A function call",
                    C: "A variable type",
                    D: "An error",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 4,
                questionText: "What is a Promise?",
                options: {
                    A: "An object representing async operation",
                    B: "A function",
                    C: "A loop",
                    D: "A variable",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 5,
                questionText: "What is destructuring?",
                options: {
                    A: "Extracting values from objects/arrays",
                    B: "Deleting objects",
                    C: "Creating objects",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
        createdAt: "2025-11-05",
        updatedAt: "2025-11-05",
    },
    {
        id: 4,
        title: "JavaScript ES6 Features Test",
        instructor: "Teacher User",
        courseId: 2,
        courseName: "Advanced JavaScript",
        description:
            "Test covering ES6+ features including arrow functions, destructuring, and more",
        dueDate: "2025-11-22",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is the spread operator?",
                options: {
                    A: "... to expand iterables",
                    B: "A multiplication operator",
                    C: "A division operator",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 2,
                questionText: "What is arrow function?",
                options: {
                    A: "A shorter function syntax",
                    B: "A loop",
                    C: "A variable",
                    D: "An object",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 3,
                questionText: "What is let vs const?",
                options: {
                    A: "let allows reassignment, const doesn't",
                    B: "They're the same",
                    C: "const is faster",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 4,
                questionText: "What is map() method?",
                options: {
                    A: "Creates new array from existing",
                    B: "Deletes array",
                    C: "Sorts array",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 5,
                questionText: "What is filter() method?",
                options: {
                    A: "Creates array with elements passing test",
                    B: "Deletes elements",
                    C: "Sorts elements",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
        createdAt: "2025-11-07",
        updatedAt: "2025-11-07",
    },

    // ====== React Native Basics ======
    {
        id: 2,
        title: "React Native Components Quiz",
        instructor: "Teacher User",
        courseId: 1,
        courseName: "React Native Basics",
        description:
            "Test your knowledge of React Native core components and their usage",
        dueDate: "2025-11-25",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is React Native?",
                options: {
                    A: "A JavaScript framework for mobile apps",
                    B: "A CSS framework",
                    C: "A database",
                    D: "A language",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 2,
                questionText: "What is JSX?",
                options: {
                    A: "JavaScript XML syntax extension",
                    B: "A programming language",
                    C: "A database query",
                    D: "A CSS preprocessor",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 3,
                questionText: "What is a Component?",
                options: {
                    A: "Reusable piece of UI",
                    B: "A function",
                    C: "A variable",
                    D: "A loop",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 4,
                questionText: "What is state?",
                options: {
                    A: "Data that changes over time",
                    B: "Static data",
                    C: "A function",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 5,
                questionText: "What is props?",
                options: {
                    A: "Data passed from parent to child",
                    B: "Local data",
                    C: "A function",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
        createdAt: "2025-11-08",
        updatedAt: "2025-11-08",
    },
    {
        id: 3,
        title: "React Hooks Assignment",
        instructor: "Teacher User",
        courseId: 1,
        courseName: "React Native Basics",
        description:
            "Assignment covering useState, useEffect, and other React hooks",
        dueDate: "2025-12-01",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is useState?",
                options: {
                    A: "Hook to manage state",
                    B: "A component",
                    C: "A style",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 2,
                questionText: "What is useEffect?",
                options: {
                    A: "Hook for side effects",
                    B: "A component",
                    C: "A state",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 3,
                questionText: "What is StyleSheet?",
                options: {
                    A: "Object for styling components",
                    B: "A component",
                    C: "A function",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 4,
                questionText: "What is FlatList?",
                options: {
                    A: "Component for rendering lists",
                    B: "A state",
                    C: "A style",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 5,
                questionText: "What is TouchableOpacity?",
                options: {
                    A: "Touchable component with opacity feedback",
                    B: "A list",
                    C: "A state",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
        createdAt: "2025-11-09",
        updatedAt: "2025-11-09",
    },

    // ====== Python for Data Science ======
    {
        id: 5,
        title: "Python Data Structures Quiz",
        instructor: "Teacher User",
        courseId: 3,
        courseName: "Python for Data Science",
        description: "Quiz on Python lists, tuples, dictionaries and sets",
        dueDate: "2025-11-23",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is a list in Python?",
                options: {
                    A: "Ordered mutable collection",
                    B: "Unordered collection",
                    C: "Immutable collection",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 2,
                questionText: "What is a tuple?",
                options: {
                    A: "Ordered immutable collection",
                    B: "Mutable collection",
                    C: "Unordered collection",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 3,
                questionText: "What is a dictionary?",
                options: {
                    A: "Key-value pair collection",
                    B: "Ordered list",
                    C: "Immutable set",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 4,
                questionText: "What is lambda?",
                options: {
                    A: "Anonymous function",
                    B: "A variable",
                    C: "A loop",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 5,
                questionText: "What is list comprehension?",
                options: {
                    A: "Compact way to create lists",
                    B: "A function",
                    C: "A module",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },
    {
        id: 6,
        title: "NumPy and Pandas Assignment",
        instructor: "Teacher User",
        courseId: 3,
        courseName: "Python for Data Science",
        description: "Assignment on manipulating data with NumPy and Pandas",
        dueDate: "2025-11-29",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is NumPy used for?",
                options: {
                    A: "Numerical computation",
                    B: "Web development",
                    C: "Data visualization",
                    D: "Networking",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 2,
                questionText: "What is a DataFrame?",
                options: {
                    A: "2D labeled data structure",
                    B: "A graph",
                    C: "A tuple",
                    D: "A variable",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 3,
                questionText: "What is pandas used for?",
                options: {
                    A: "Data manipulation",
                    B: "Machine learning",
                    C: "Web design",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 4,
                questionText: "What is np.array?",
                options: {
                    A: "Creates an array object",
                    B: "Creates a list",
                    C: "Creates a dict",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 5,
                questionText: "What is df.head()?",
                options: {
                    A: "Shows first 5 rows",
                    B: "Shows last 5 rows",
                    C: "Deletes rows",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },

    // ... (tương tự cho các khóa còn lại)
];


// In-memory data store
let dataStore = {
    // users: mockUsers,
    // courses: mockCourses,
    // quizzes: mockQuizzes,
    // certificates: mockCertificates,
    assignments: mockAssignments,
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
        // certificates: mockCertificates,
        assignments: mockAssignments,
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
