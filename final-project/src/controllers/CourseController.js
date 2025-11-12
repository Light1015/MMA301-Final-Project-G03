// Course Controller - Handles course-related business logic

import CourseModel from "../models/CourseModel";
import { mockCourses } from "../database/collections/courses";

class CourseController {
  constructor() {
    // Initialize courses from database
    CourseModel.initCourses([...mockCourses]);
  }

  // Get all courses
  getAllCourses() {
    try {
      return {
        success: true,
        data: CourseModel.getAllCourses(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get courses for a specific teacher (by email for consistency)
  getTeacherCourses(instructorEmail) {
    try {
      // Try to get by email first (new method)
      let courses = CourseModel.getCoursesByInstructorEmail(instructorEmail);

      // If no courses found by email, try by name (backward compatibility)
      if (courses.length === 0) {
        courses = CourseModel.getCoursesByInstructor(instructorEmail);
      }

      return {
        success: true,
        data: courses,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get course by ID
  getCourseById(id) {
    try {
      const course = CourseModel.getCourseById(id);
      if (course) {
        return {
          success: true,
          data: course,
        };
      }
      return {
        success: false,
        error: "Course not found",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Create new course
  createCourse(courseData, instructorIdentifier) {
    try {
      // Validate required fields
      if (!courseData.title || !courseData.description) {
        return {
          success: false,
          error: "Title and description are required",
        };
      }

      // If instructorIdentifier looks like email, use it as email
      // Otherwise use it as name (backward compatibility)
      const isEmail = instructorIdentifier.includes("@");

      const newCourse = CourseModel.createCourse({
        ...courseData,
        instructor: instructorIdentifier,
        email: isEmail ? instructorIdentifier : courseData.email,
      });

      return {
        success: true,
        data: newCourse,
        message: "Course created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update course
  updateCourse(id, courseData, instructorIdentifier) {
    try {
      // Check if course exists
      const existingCourse = CourseModel.getCourseById(id);
      if (!existingCourse) {
        return {
          success: false,
          error: "Course not found",
        };
      }

      // Check ownership by email or name
      const isEmail = instructorIdentifier.includes("@");
      const isOwner = isEmail
        ? existingCourse.email === instructorIdentifier
        : existingCourse.instructor === instructorIdentifier;

      if (!isOwner) {
        return {
          success: false,
          error: "You can only update your own courses",
        };
      }

      const updatedCourse = CourseModel.updateCourse(id, courseData);
      return {
        success: true,
        data: updatedCourse,
        message: "Course updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Delete course
  deleteCourse(id, instructorIdentifier) {
    try {
      // Check if course exists
      const existingCourse = CourseModel.getCourseById(id);
      if (!existingCourse) {
        return {
          success: false,
          error: "Course not found",
        };
      }

      // Check ownership by email or name
      const isEmail = instructorIdentifier.includes("@");
      const isOwner = isEmail
        ? existingCourse.email === instructorIdentifier
        : existingCourse.instructor === instructorIdentifier;

      if (!isOwner) {
        return {
          success: false,
          error: "You can only delete your own courses",
        };
      }

      const deletedCourse = CourseModel.deleteCourse(id);
      return {
        success: true,
        data: deletedCourse,
        message: "Course deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Search courses
  searchCourses(query) {
    try {
      const results = CourseModel.searchCourses(query);
      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get course statistics for teacher
  getTeacherStats(instructorIdentifier) {
    try {
      // Try email first, then name
      const isEmail = instructorIdentifier.includes("@");
      const stats = isEmail
        ? CourseModel.getCourseStats(instructorIdentifier)
        : CourseModel.getCourseStats(instructorIdentifier);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new CourseController();
