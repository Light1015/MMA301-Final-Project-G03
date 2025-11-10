// Quiz Model - Manages quiz data operations (CourseModel-like)

export class QuizModel {
    constructor() {
        this.quizzes = [];
    }

    // Initialize quizzes from database
    initQuizzes(quizzesData) {
        this.quizzes = quizzesData || [];
    }

    // Get all quizzes
    getAllQuizzes() {
        return this.quizzes;
    }

    // Get quizzes by instructor
    getQuizzesByInstructor(instructorName) {
        return this.quizzes.filter((quiz) => quiz.instructor === instructorName);
    }

    // Get quiz by ID
    getQuizById(id) {
        return this.quizzes.find((quiz) => quiz.id === id);
    }

    // Create new quiz
    createQuiz(quizData) {
        const newQuiz = {
            id:
                this.quizzes.length > 0
                    ? Math.max(...this.quizzes.map((q) => q.id)) + 1
                    : 1,
            title: quizData.title || "Untitled Quiz",
            instructor: quizData.instructor || "",
            courseId: quizData.courseId || null,
            courseName: quizData.courseName || "",
            questions: quizData.questions || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.quizzes.push(newQuiz);
        return newQuiz;
    }

    // Update quiz
    updateQuiz(id, quizData) {
        const index = this.quizzes.findIndex((quiz) => quiz.id === id);
        if (index !== -1) {
            this.quizzes[index] = {
                ...this.quizzes[index],
                ...quizData,
                updatedAt: new Date().toISOString(),
            };
            return this.quizzes[index];
        }
        return null;
    }

    // Delete quiz
    deleteQuiz(id) {
        const index = this.quizzes.findIndex((quiz) => quiz.id === id);
        if (index !== -1) {
            const deletedQuiz = this.quizzes[index];
            this.quizzes.splice(index, 1);
            return deletedQuiz;
        }
        return null;
    }

    // Search quizzes
    searchQuizzes(query) {
        const lowerQuery = query.toLowerCase();
        return this.quizzes.filter(
            (quiz) =>
                (quiz.title || "").toLowerCase().includes(lowerQuery) ||
                (quiz.courseName || "").toLowerCase().includes(lowerQuery) ||
                (quiz.instructor || "").toLowerCase().includes(lowerQuery)
        );
    }

    // Get quiz statistics for instructor
    getInstructorStats(instructorName) {
        const instructorQuizzes = this.getQuizzesByInstructor(instructorName);
        const totalQuestions = instructorQuizzes.reduce(
            (sum, q) => sum + (q.questions ? q.questions.length : 0),
            0
        );

        return {
            totalQuizzes: instructorQuizzes.length,
            totalQuestions,
        };
    }

    // Question helpers
    addQuestion(quizId, question) {
        const quiz = this.getQuizById(quizId);
        if (!quiz) return null;
        const newQuestion = {
            id: quiz.questions && quiz.questions.length > 0 ? Math.max(...quiz.questions.map((qq) => qq.id)) + 1 : 1,
            text: question.text || "",
            options: question.options || [],
            answerIndex: typeof question.answerIndex === 'number' ? question.answerIndex : 0,
        };
        quiz.questions = quiz.questions || [];
        quiz.questions.push(newQuestion);
        quiz.updatedAt = new Date().toISOString();
        return newQuestion;
    }

    updateQuestion(quizId, questionId, questionData) {
        const quiz = this.getQuizById(quizId);
        if (!quiz || !quiz.questions) return null;
        const index = quiz.questions.findIndex((qq) => qq.id === questionId);
        if (index === -1) return null;
        quiz.questions[index] = { ...quiz.questions[index], ...questionData };
        quiz.updatedAt = new Date().toISOString();
        return quiz.questions[index];
    }

    deleteQuestion(quizId, questionId) {
        const quiz = this.getQuizById(quizId);
        if (!quiz || !quiz.questions) return null;
        const index = quiz.questions.findIndex((qq) => qq.id === questionId);
        if (index === -1) return null;
        const removed = quiz.questions[index];
        quiz.questions.splice(index, 1);
        quiz.updatedAt = new Date().toISOString();
        return removed;
    }
}

export default new QuizModel();
