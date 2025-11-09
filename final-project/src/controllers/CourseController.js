// Course Controller - Handles course-related business logic

import CourseModel from '../models/CourseModel';
import { mockCourses } from '../database/db';

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

  // Get courses for a specific teacher
  getTeacherCourses(instructorName) {
    try {
      const courses = CourseModel.getCoursesByInstructor(instructorName);
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
        error: 'Course not found',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Create new course
  createCourse(courseData, instructorName) {
    try {
      // Validate required fields
      if (!courseData.title || !courseData.description) {
        return {
          success: false,
          error: 'Title and description are required',
        };
      }

      const newCourse = CourseModel.createCourse({
        ...courseData,
        instructor: instructorName,
      });

      return {
        success: true,
        data: newCourse,
        message: 'Course created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update course
  updateCourse(id, courseData, instructorName) {
    try {
      // Check if course exists and belongs to instructor
      const existingCourse = CourseModel.getCourseById(id);
      if (!existingCourse) {
        return {
          success: false,
          error: 'Course not found',
        };
      }

      if (existingCourse.instructor !== instructorName) {
        return {
          success: false,
          error: 'You can only update your own courses',
        };
      }

      const updatedCourse = CourseModel.updateCourse(id, courseData);
      return {
        success: true,
        data: updatedCourse,
        message: 'Course updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Delete course
  deleteCourse(id, instructorName) {
    try {
      // Check if course exists and belongs to instructor
      const existingCourse = CourseModel.getCourseById(id);
      if (!existingCourse) {
        return {
          success: false,
          error: 'Course not found',
        };
      }

      if (existingCourse.instructor !== instructorName) {
        return {
          success: false,
          error: 'You can only delete your own courses',
        };
      }

      const deletedCourse = CourseModel.deleteCourse(id);
      return {
        success: true,
        data: deletedCourse,
        message: 'Course deleted successfully',
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
  getTeacherStats(instructorName) {
    try {
      const stats = CourseModel.getCourseStats(instructorName);
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
