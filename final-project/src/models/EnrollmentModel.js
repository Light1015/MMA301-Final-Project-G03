// Enrollment Model - Manages user course enrollments

import { mockEnrollments } from "../database/collections/enrollments";

const EnrollmentModel = {
  // Get all enrollments for a specific user
  getUserEnrollments: async (userEmail) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const enrollments = mockEnrollments.filter(
          (enrollment) => enrollment.userEmail === userEmail
        );
        resolve(enrollments);
      }, 300);
    });
  },

  // Get enrollment by ID
  getEnrollmentById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const enrollment = mockEnrollments.find((e) => e.id === id);
        resolve(enrollment);
      }, 300);
    });
  },

  // Get enrollments by status
  getUserEnrollmentsByStatus: async (userEmail, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const enrollments = mockEnrollments.filter(
          (enrollment) =>
            enrollment.userEmail === userEmail && enrollment.status === status
        );
        resolve(enrollments);
      }, 300);
    });
  },

  // Get enrollment stats for user
  getUserEnrollmentStats: async (userEmail) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userEnrollments = mockEnrollments.filter(
          (e) => e.userEmail === userEmail
        );

        const enrolled = userEnrollments.filter(
          (e) => e.status === "enrolled"
        ).length;
        const inProgress = userEnrollments.filter(
          (e) => e.status === "in-progress"
        ).length;
        const completed = userEnrollments.filter(
          (e) => e.status === "completed"
        ).length;

        resolve({
          total: userEnrollments.length,
          enrolled,
          inProgress,
          completed,
        });
      }, 300);
    });
  },

  // Create new enrollment
  createEnrollment: async (enrollmentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEnrollment = {
          id:
            mockEnrollments.length > 0
              ? Math.max(...mockEnrollments.map((e) => e.id)) + 1
              : 1,
          ...enrollmentData,
          enrollDate: new Date().toISOString().split("T")[0],
          progress: 0,
          status: "enrolled",
          lastAccessed: new Date().toISOString().split("T")[0],
        };
        mockEnrollments.push(newEnrollment);
        resolve(newEnrollment);
      }, 300);
    });
  },

  // Update enrollment progress
  updateEnrollmentProgress: async (id, progress) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const enrollment = mockEnrollments.find((e) => e.id === id);
        if (enrollment) {
          enrollment.progress = progress;
          enrollment.lastAccessed = new Date().toISOString().split("T")[0];

          // Auto update status based on progress
          if (progress === 0) {
            enrollment.status = "enrolled";
          } else if (progress === 100) {
            enrollment.status = "completed";
            enrollment.completedDate = new Date().toISOString().split("T")[0];
          } else {
            enrollment.status = "in-progress";
          }

          resolve(enrollment);
        } else {
          reject({ message: "Enrollment not found" });
        }
      }, 300);
    });
  },

  // Update enrollment status
  updateEnrollmentStatus: async (id, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const enrollment = mockEnrollments.find((e) => e.id === id);
        if (enrollment) {
          enrollment.status = status;
          enrollment.lastAccessed = new Date().toISOString().split("T")[0];

          if (status === "completed" && !enrollment.completedDate) {
            enrollment.completedDate = new Date().toISOString().split("T")[0];
          }

          resolve(enrollment);
        } else {
          reject({ message: "Enrollment not found" });
        }
      }, 300);
    });
  },

  // Delete enrollment
  deleteEnrollment: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockEnrollments.findIndex((e) => e.id === id);
        if (index !== -1) {
          const deleted = mockEnrollments.splice(index, 1);
          resolve(deleted[0]);
        } else {
          reject({ message: "Enrollment not found" });
        }
      }, 300);
    });
  },
};

export default EnrollmentModel;
