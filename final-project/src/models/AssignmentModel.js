// Assignment Model - Manages assignment data operations

export class AssignmentModel {
    constructor() {
        this.assignments = [];
    }

    // Initialize assignments from database
    initAssignments(assignmentsData) {
        this.assignments = assignmentsData || [];
    }

    // Get all assignments
    getAllAssignments() {
        return this.assignments;
    }

    // Get assignments by instructor
    getAssignmentsByInstructor(instructorName) {
        return this.assignments.filter((assignment) => assignment.instructor === instructorName);
    }

    // Get assignment by ID
    getAssignmentById(id) {
        return this.assignments.find((assignment) => assignment.id === id);
    }

    // Get assignments by course
    getAssignmentsByCourse(courseId) {
        return this.assignments.filter((assignment) => Number(assignment.courseId) === Number(courseId));
    }

    // Create new assignment
    createAssignment(assignmentData) {
        const newAssignment = {
            id:
                this.assignments.length > 0
                    ? Math.max(...this.assignments.map((a) => a.id)) + 1
                    : 1,
            title: assignmentData.title || "Untitled Assignment",
            instructor: assignmentData.instructor || "",
            courseId: assignmentData.courseId || null,
            courseName: assignmentData.courseName || "",
            description: assignmentData.description || "",
            dueDate: assignmentData.dueDate || null,
            totalPoints: assignmentData.totalPoints || 100,
            questions: assignmentData.questions || [], // Array of selected questions
            status: assignmentData.status || "draft", // draft, published, closed
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.assignments.push(newAssignment);
        return newAssignment;
    }

    // Update assignment
    updateAssignment(id, assignmentData) {
        const index = this.assignments.findIndex((assignment) => assignment.id === id);
        if (index !== -1) {
            this.assignments[index] = {
                ...this.assignments[index],
                ...assignmentData,
                updatedAt: new Date().toISOString(),
            };
            return this.assignments[index];
        }
        return null;
    }

    // Delete assignment
    deleteAssignment(id) {
        const index = this.assignments.findIndex((assignment) => assignment.id === id);
        if (index !== -1) {
            const deletedAssignment = this.assignments[index];
            this.assignments.splice(index, 1);
            return deletedAssignment;
        }
        return null;
    }

    // Search assignments
    searchAssignments(query) {
        const lowerQuery = query.toLowerCase();
        return this.assignments.filter(
            (assignment) =>
                (assignment.title || "").toLowerCase().includes(lowerQuery) ||
                (assignment.courseName || "").toLowerCase().includes(lowerQuery) ||
                (assignment.instructor || "").toLowerCase().includes(lowerQuery)
        );
    }

    // Get assignment statistics for instructor
    getInstructorStats(instructorName) {
        const instructorAssignments = this.getAssignmentsByInstructor(instructorName);
        const totalQuestions = instructorAssignments.reduce(
            (sum, a) => sum + (a.questions ? a.questions.length : 0),
            0
        );

        return {
            totalAssignments: instructorAssignments.length,
            totalQuestions,
            published: instructorAssignments.filter(a => a.status === 'published').length,
            draft: instructorAssignments.filter(a => a.status === 'draft').length,
        };
    }

    // Add questions to assignment (can be from quiz or individual questions)
    addQuestionsToAssignment(assignmentId, questions) {
        const assignment = this.getAssignmentById(assignmentId);
        if (!assignment) return null;

        assignment.questions = assignment.questions || [];
        questions.forEach(q => {
            const newQuestion = {
                id: assignment.questions.length > 0 ? Math.max(...assignment.questions.map((qq) => qq.id)) + 1 : 1,
                questionText: q.questionText,
                options: q.options,
                correctAnswer: q.correctAnswer,
                points: q.points || 1,
                sourceQuizId: q.sourceQuizId || null,
                sourceQuestionId: q.sourceQuestionId || null,
            };
            assignment.questions.push(newQuestion);
        });

        assignment.updatedAt = new Date().toISOString();
        return assignment;
    }

    // Remove question from assignment
    removeQuestionFromAssignment(assignmentId, questionId) {
        const assignment = this.getAssignmentById(assignmentId);
        if (!assignment || !assignment.questions) return null;
        const index = assignment.questions.findIndex((qq) => qq.id === questionId);
        if (index === -1) return null;
        const removed = assignment.questions[index];
        assignment.questions.splice(index, 1);
        assignment.updatedAt = new Date().toISOString();
        return removed;
    }

    // Update assignment status
    updateStatus(id, status) {
        const assignment = this.getAssignmentById(id);
        if (!assignment) return null;
        assignment.status = status;
        assignment.updatedAt = new Date().toISOString();
        return assignment;
    }
}

export default new AssignmentModel();
