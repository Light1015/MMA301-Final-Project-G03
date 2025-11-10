import QuizModel from "../models/QuizModel";
import QuestionModel from "../models/QuestionModel";
import { mockQuizzes } from "../database/db";

class QuizController {
    constructor() {
        QuizModel.initQuizzes([...mockQuizzes]);
    }

    getAllQuizzes() {
        try {
            return { success: true, data: QuizModel.getAllQuizzes() };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    getTeacherQuizzes(instructorName) {
        try {
            return { success: true, data: QuizModel.getQuizzesByInstructor(instructorName) };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    getQuizById(id) {
        try {
            const q = QuizModel.getQuizById(id);
            if (!q) return { success: false, error: "Quiz not found" };
            return { success: true, data: q };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    createQuiz(quizData, instructorName) {
        try {
            if (!quizData.title) return { success: false, error: "Title is required" };
            const newQ = QuizModel.createQuiz({ ...quizData, instructor: instructorName });
            return { success: true, data: newQ, message: "Quiz created" };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    updateQuiz(id, quizData, instructorName) {
        try {
            const existing = QuizModel.getQuizById(id);
            if (!existing) return { success: false, error: "Quiz not found" };
            if (existing.instructor !== instructorName) return { success: false, error: "Not authorized" };
            const updated = QuizModel.updateQuiz(id, quizData);
            return { success: true, data: updated, message: "Quiz updated" };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    deleteQuiz(id, instructorName) {
        try {
            const existing = QuizModel.getQuizById(id);
            if (!existing) return { success: false, error: "Quiz not found" };
            if (existing.instructor !== instructorName) return { success: false, error: "Not authorized" };
            const removed = QuizModel.deleteQuiz(id);
            return { success: true, data: removed, message: "Quiz deleted" };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    // Questions
    addQuestion(quizId, question, instructorName) {
        try {
            const q = QuizModel.getQuizById(quizId);
            if (!q) return { success: false, error: "Quiz not found" };
            if (q.instructor !== instructorName) return { success: false, error: "Not authorized" };

            const validation = QuestionModel.validateQuestion(question);
            if (!validation.valid) return { success: false, error: validation.error };

            const added = QuizModel.addQuestion(quizId, validation.question);
            return { success: true, data: added, message: "Question added" };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    updateQuestion(quizId, questionId, questionData, instructorName) {
        try {
            const q = QuizModel.getQuizById(quizId);
            if (!q) return { success: false, error: "Quiz not found" };
            if (q.instructor !== instructorName) return { success: false, error: "Not authorized" };
            const validation = QuestionModel.validateQuestion(questionData);
            if (!validation.valid) return { success: false, error: validation.error };

            const updated = QuizModel.updateQuestion(quizId, questionId, validation.question);
            if (!updated) return { success: false, error: "Question not found" };
            return { success: true, data: updated, message: "Question updated" };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    deleteQuestion(quizId, questionId, instructorName) {
        try {
            const q = QuizModel.getQuizById(quizId);
            if (!q) return { success: false, error: "Quiz not found" };
            if (q.instructor !== instructorName) return { success: false, error: "Not authorized" };
            const removed = QuizModel.deleteQuestion(quizId, questionId);
            if (!removed) return { success: false, error: "Question not found" };
            return { success: true, data: removed, message: "Question removed" };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
}

export default new QuizController();
