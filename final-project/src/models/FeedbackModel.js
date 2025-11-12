// Feedback Model - Manages course feedbacks

import { mockFeedbacks } from "../database/collections/feedbacks";

const FeedbackModel = {
  // Get all feedbacks for a specific user
  getUserFeedbacks: async (userEmail) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedbacks = mockFeedbacks.filter(
          (feedback) => feedback.userEmail === userEmail
        );
        resolve(feedbacks);
      }, 300);
    });
  },

  // Get all feedbacks for a specific course
  getCourseFeedbacks: async (courseId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedbacks = mockFeedbacks.filter(
          (feedback) => feedback.courseId === courseId
        );
        resolve(feedbacks);
      }, 300);
    });
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedback = mockFeedbacks.find((f) => f.id === id);
        resolve(feedback);
      }, 300);
    });
  },

  // Create new feedback
  createFeedback: async (feedbackData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFeedback = {
          id:
            mockFeedbacks.length > 0
              ? Math.max(...mockFeedbacks.map((f) => f.id)) + 1
              : 1,
          ...feedbackData,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
        mockFeedbacks.push(newFeedback);
        resolve(newFeedback);
      }, 300);
    });
  },

  // Update feedback
  updateFeedback: async (id, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const feedback = mockFeedbacks.find((f) => f.id === id);
        if (feedback) {
          Object.assign(feedback, updates, {
            updatedAt: new Date().toISOString().split("T")[0],
          });
          resolve(feedback);
        } else {
          reject({ message: "Feedback not found" });
        }
      }, 300);
    });
  },

  // Delete feedback
  deleteFeedback: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFeedbacks.findIndex((f) => f.id === id);
        if (index !== -1) {
          const deleted = mockFeedbacks.splice(index, 1);
          resolve(deleted[0]);
        } else {
          reject({ message: "Feedback not found" });
        }
      }, 300);
    });
  },

  // Get average rating for a course
  getCourseAverageRating: async (courseId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courseFeedbacks = mockFeedbacks.filter(
          (f) => f.courseId === courseId
        );

        if (courseFeedbacks.length === 0) {
          resolve({ average: 0, count: 0 });
        } else {
          const sum = courseFeedbacks.reduce((acc, f) => acc + f.rating, 0);
          const average = (sum / courseFeedbacks.length).toFixed(1);
          resolve({
            average: parseFloat(average),
            count: courseFeedbacks.length,
          });
        }
      }, 300);
    });
  },
};

export default FeedbackModel;
