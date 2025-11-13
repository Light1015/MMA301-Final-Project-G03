export const mockAssignments = [
    // ====== Advanced JavaScript ======
    {
        id: 23,
        title: "NumPy Basics Quiz",
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

    // === PYTHON FOR DATA SCIENCE ===
    {
        id: 21,
        title: "Python Data Structures Assignment",
        instructor: "Teacher User",
        courseId: 3,
        courseName: "Python for Data Science",
        description: "Assignment focusing on Python lists, dictionaries, and tuples.",
        dueDate: "2025-11-28",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is a list in Python?",
                options: { A: "Ordered collection", B: "Unordered set", C: "Database", D: "None" },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 2,
                questionText: "What method adds an item to a list?",
                options: { A: "append()", B: "push()", C: "add()", D: "insertAll()" },
                correctAnswer: "A",
                points: 10,
            },
        ],
        createdAt: "2025-11-10",
        updatedAt: "2025-11-10",
    },
    {
        id: 22,
        title: "NumPy Basics Quiz",
        instructor: "Teacher User",
        courseId: 3,
        courseName: "Python for Data Science",
        description: "Test covering NumPy arrays and vectorized operations.",
        dueDate: "2025-12-02",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What does NumPy stand for?",
                options: { A: "Numerical Python", B: "Numeric Parser", C: "None", D: "Network Python" },
                correctAnswer: "A",
                points: 10,
            },
            {
                id: 2,
                questionText: "What is np.array() used for?",
                options: { A: "Creating arrays", B: "Plotting graphs", C: "Sorting", D: "None" },
                correctAnswer: "A",
                points: 10,
            },
        ],
        createdAt: "2025-11-11",
        updatedAt: "2025-11-11",
    },

    // === WEB DEVELOPMENT BOOTCAMP ===
    {
        id: 7,
        title: "HTML & CSS Fundamentals",
        instructor: "Teacher User",
        courseId: 4,
        courseName: "Web Development Bootcamp",
        description: "Assignment testing HTML structure and CSS styling.",
        dueDate: "2025-11-22",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What tag defines a hyperlink?",
                options: { A: "<a>", B: "<link>", C: "<href>", D: "<h1>" },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },
    {
        id: 8,
        title: "JavaScript DOM Manipulation",
        instructor: "Teacher User",
        courseId: 4,
        courseName: "Web Development Bootcamp",
        description: "Quiz about DOM elements and JS interaction.",
        dueDate: "2025-12-01",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What does document.querySelector() do?",
                options: {
                    A: "Selects the first matching element",
                    B: "Deletes an element",
                    C: "Creates a tag",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },

    // === UI/UX DESIGN PRINCIPLES ===
    {
        id: 9,
        title: "Design Thinking Principles",
        instructor: "Teacher User",
        courseId: 5,
        courseName: "UI/UX Design Principles",
        description: "Assignment covering empathy, define, ideate stages.",
        dueDate: "2025-11-26",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "Which is the first step in design thinking?",
                options: { A: "Empathize", B: "Define", C: "Prototype", D: "Test" },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },
    {
        id: 10,
        title: "User Interface Patterns Quiz",
        instructor: "Teacher User",
        courseId: 5,
        courseName: "UI/UX Design Principles",
        description: "Test common UI patterns and usability heuristics.",
        dueDate: "2025-12-03",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is a modal?",
                options: { A: "Popup dialog", B: "Menu bar", C: "Table", D: "Link" },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },

    // === GRAPHIC DESIGN MASTERCLASS ===
    {
        id: 11,
        title: "Color Theory Quiz",
        instructor: "Teacher User",
        courseId: 6,
        courseName: "Graphic Design Masterclass",
        description: "Understanding color harmony and contrast.",
        dueDate: "2025-11-23",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What are complementary colors?",
                options: {
                    A: "Opposite on color wheel",
                    B: "Next to each other",
                    C: "Monochrome shades",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },
    {
        id: 12,
        title: "Typography Fundamentals",
        instructor: "Teacher User",
        courseId: 6,
        courseName: "Graphic Design Masterclass",
        description: "Assignment testing font pairing and hierarchy.",
        dueDate: "2025-11-30",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is kerning?",
                options: {
                    A: "Spacing between letters",
                    B: "Line spacing",
                    C: "Font style",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },

    // === DIGITAL MARKETING STRATEGY ===
    {
        id: 13,
        title: "SEO Basics Assignment",
        instructor: "Teacher User",
        courseId: 7,
        courseName: "Digital Marketing Strategy",
        description: "Covers keywords, on-page and off-page SEO.",
        dueDate: "2025-11-24",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What does SEO stand for?",
                options: {
                    A: "Search Engine Optimization",
                    B: "Site Evaluation Online",
                    C: "Server Engine Output",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },
    {
        id: 14,
        title: "Social Media Marketing Quiz",
        instructor: "Teacher User",
        courseId: 7,
        courseName: "Digital Marketing Strategy",
        description: "Testing social campaign metrics and engagement KPIs.",
        dueDate: "2025-12-02",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "Which metric measures audience engagement?",
                options: {
                    A: "Likes and comments",
                    B: "URL length",
                    C: "Server speed",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },

    // === PROJECT MANAGEMENT PROFESSIONAL ===
    {
        id: 15,
        title: "Agile Fundamentals Assignment",
        instructor: "Teacher User",
        courseId: 8,
        courseName: "Project Management Professional",
        description: "Assignment focusing on Agile methodology and Scrum roles.",
        dueDate: "2025-11-27",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "Who owns the product backlog?",
                options: { A: "Product Owner", B: "Scrum Master", C: "Team", D: "Client" },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },
    {
        id: 16,
        title: "Risk Management Quiz",
        instructor: "Teacher User",
        courseId: 8,
        courseName: "Project Management Professional",
        description: "Test covering risk identification and mitigation planning.",
        dueDate: "2025-12-05",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is risk mitigation?",
                options: {
                    A: "Reducing impact of risks",
                    B: "Ignoring risks",
                    C: "Listing all issues",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },

    // === PUBLIC SPEAKING & PRESENTATION SKILLS ===
    {
        id: 17,
        title: "Speech Structure Assignment",
        instructor: "Teacher User",
        courseId: 9,
        courseName: "Public Speaking & Presentation Skills",
        description: "Design a 3-minute speech with clear intro, body, conclusion.",
        dueDate: "2025-11-26",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What part of speech grabs attention?",
                options: { A: "Introduction", B: "Body", C: "Conclusion", D: "None" },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },
    {
        id: 18,
        title: "Presentation Delivery Quiz",
        instructor: "Teacher User",
        courseId: 9,
        courseName: "Public Speaking & Presentation Skills",
        description: "Quiz covering body language and tone control.",
        dueDate: "2025-12-04",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What improves stage presence?",
                options: { A: "Eye contact", B: "Reading slides", C: "Turning away", D: "None" },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },

    // === PHOTOGRAPHY FUNDAMENTALS ===
    {
        id: 19,
        title: "Camera Settings Quiz",
        instructor: "Teacher User",
        courseId: 10,
        courseName: "Photography Fundamentals",
        description: "Quiz about ISO, shutter speed, and aperture.",
        dueDate: "2025-11-25",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What does ISO control?",
                options: {
                    A: "Sensor sensitivity",
                    B: "Lens zoom",
                    C: "Focus",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },
    {
        id: 20,
        title: "Composition Techniques Assignment",
        instructor: "Teacher User",
        courseId: 10,
        courseName: "Photography Fundamentals",
        description: "Assignment applying rule of thirds and leading lines.",
        dueDate: "2025-12-03",
        totalPoints: 50,
        status: "published",
        questions: [
            {
                id: 1,
                questionText: "What is the rule of thirds?",
                options: {
                    A: "Dividing frame into 9 equal parts",
                    B: "Using three cameras",
                    C: "Shooting three photos",
                    D: "None",
                },
                correctAnswer: "A",
                points: 10,
            },
        ],
    },

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
