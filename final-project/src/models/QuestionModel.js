// QuestionModel - validator/normalizer for question objects

const validAnswers = ["A", "B", "C", "D"];

const validateQuestion = (q) => {
    if (!q || typeof q !== "object") return { valid: false, error: "Question must be an object" };
    const questionText = (q.questionText || "").toString().trim();
    if (!questionText) return { valid: false, error: "questionText is required" };

    const opts = q.options || {};
    const A = (opts.A || "").toString().trim();
    const B = (opts.B || "").toString().trim();
    const C = (opts.C || "").toString().trim();
    const D = (opts.D || "").toString().trim();
    if (!A || !B || !C || !D) return { valid: false, error: "All options A/B/C/D are required" };

    const correctAnswer = (q.correctAnswer || "").toString().trim();
    if (!validAnswers.includes(correctAnswer)) return { valid: false, error: "correctAnswer must be one of 'A','B','C','D'" };

    return {
        valid: true,
        question: {
            questionText,
            options: { A, B, C, D },
            correctAnswer,
        },
    };
};

export default {
    validateQuestion,
};
