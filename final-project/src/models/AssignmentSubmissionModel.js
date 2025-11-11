// Assignment Submission Model - Manages learner assignment submissions

import { mockAssignmentSubmissions } from '../database/db';

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
                const { mockAssignments } = require('../database/db');
                const courseAssignments = mockAssignments.filter(
                    (a) => a.courseId === courseId && a.status === 'published'
                );

                if (courseAssignments.length === 0) {
                    resolve({ completed: 0, total: 0, percentage: 0 }); // No assignments = 0% progress
                    return;
                }

                // Get user submissions for these assignments
                const submissions = mockAssignmentSubmissions.filter(
                    (sub) =>
                        sub.courseId === courseId &&
                        sub.userEmail === userEmail &&
                        sub.status === 'submitted'
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
};

export default AssignmentSubmissionModel;
