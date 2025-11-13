// Assignment Submission Model - Manages learner assignment submissions
import { saveData, loadData } from "../database/collections/assignments";
import { mockAssignmentSubmissions } from '../database/collections/assignmentSubmissions';

const AssignmentSubmissionModel = {
    // Get all submissions for a user
    getUserSubmissions: async (userEmail) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const submissions = mockAssignmentSubmissions.filter(
                    (sub) => sub.userEmail === userEmail
                );
                resolve(submissions);
            }, 300);
        });
    },

    // Get submission by assignment and user
    getSubmission: async (assignmentId, userEmail) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const submission = mockAssignmentSubmissions.find(
                    (sub) => sub.assignmentId === assignmentId && sub.userEmail === userEmail
                );
                resolve(submission || null);
            }, 300);
        });
    },

    // Get all submissions for a course by user
    getCourseSubmissions: async (courseId, userEmail) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const submissions = mockAssignmentSubmissions.filter(
                    (sub) => sub.courseId === courseId && sub.userEmail === userEmail
                );
                resolve(submissions);
            }, 300);
        });
    },

    // Create or update submission
    submitAssignment: async (submissionData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const existingIndex = mockAssignmentSubmissions.findIndex(
                    (sub) =>
                        sub.assignmentId === submissionData.assignmentId &&
                        sub.userEmail === submissionData.userEmail
                );

                if (existingIndex !== -1) {
                    // Update existing submission
                    mockAssignmentSubmissions[existingIndex] = {
                        ...mockAssignmentSubmissions[existingIndex],
                        answers: submissionData.answers,
                        score: submissionData.score,
                        totalPoints: submissionData.totalPoints,
                        status: 'submitted',
                        submittedAt: new Date().toISOString(),
                    };
                    resolve(mockAssignmentSubmissions[existingIndex]);
                } else {
                    // Create new submission
                    const newSubmission = {
                        id:
                            mockAssignmentSubmissions.length > 0
                                ? Math.max(...mockAssignmentSubmissions.map((s) => s.id)) + 1
                                : 1,
                        ...submissionData,
                        status: 'submitted',
                        submittedAt: new Date().toISOString(),
                    };
                    mockAssignmentSubmissions.push(newSubmission);
                    resolve(newSubmission);
                }
            }, 300);
        });
    },

    // Calculate course completion percentage
    getCourseCompletionRate: async (courseId, userEmail) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Get all published assignments for the course
                const { mockAssignments } = require('../database/collections/assignments');
                const courseAssignments = mockAssignments.filter(
                    (a) => a.courseId === courseId && a.status === 'published'
                );

                if (courseAssignments.length === 0) {
                    resolve({ completed: 0, total: 0, percentage: 0 }); // No assignments = 0% progress
                    return;
                }

                // Get user submissions for these assignments
                // Count only submissions that are 'submitted' AND have a passing percentage (>=50)
                const submissions = mockAssignmentSubmissions.filter(
                    (sub) =>
                        sub.courseId === courseId &&
                        sub.userEmail === userEmail &&
                        sub.status === 'submitted' &&
                        (typeof sub.percentage !== 'undefined' ? sub.percentage : (sub.totalPoints > 0 ? Math.round((sub.score / sub.totalPoints) * 100) : 0)) >= 50
                );

                const completedCount = submissions.length;
                const totalCount = courseAssignments.length;
                const percentage = Math.round((completedCount / totalCount) * 100);

                resolve({
                    completed: completedCount,
                    total: totalCount,
                    percentage,
                });
            }, 300);
        });
    },

    // Check if all assignments are completed for a course
    isAllAssignmentsCompleted: async (courseId, userEmail) => {
        return new Promise(async (resolve) => {
            const completion = await AssignmentSubmissionModel.getCourseCompletionRate(
                courseId,
                userEmail
            );
            resolve(completion.percentage === 100);
        });
    },

    // Delete a user's submission for an assignment
    deleteSubmission: async (assignmentId, userEmail) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockAssignmentSubmissions.findIndex(
                    (sub) => sub.assignmentId === assignmentId && sub.userEmail === userEmail
                );
                if (index !== -1) {
                    const removed = mockAssignmentSubmissions.splice(index, 1);
                    resolve(removed[0]);
                } else {
                    resolve(null);
                }
            }, 300);
        });
    },
};

export default AssignmentSubmissionModel;
