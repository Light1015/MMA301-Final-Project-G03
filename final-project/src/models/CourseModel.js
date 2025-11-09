// Course Model - Manages course data operations

export class CourseModel {
  constructor() {
    this.courses = [];
  }

  // Initialize courses from database
  initCourses(coursesData) {
    this.courses = coursesData || [];
  }

  // Get all courses
  getAllCourses() {
    return this.courses;
  }

  // Get courses by instructor
  getCoursesByInstructor(instructorName) {
    return this.courses.filter(
      (course) => course.instructor === instructorName
    );
  }

  // Get course by ID
  getCourseById(id) {
    return this.courses.find((course) => course.id === id);
  }

  // Create new course
  createCourse(courseData) {
    // Normalize category: chỉ chấp nhận Programming, Design, Business; còn lại là General
    const validCategories = ["Programming", "Design", "Business"];
    let category = courseData.category || "General";
    if (!validCategories.includes(category)) {
      category = "General";
    }

    const newCourse = {
      id:
        this.courses.length > 0
          ? Math.max(...this.courses.map((c) => c.id)) + 1
          : 1,
      title: courseData.title,
      instructor: courseData.instructor,
      description: courseData.description,
      duration: courseData.duration,
      students: 0,
      rating: 0,
      image:
        courseData.image ||
        "https://via.placeholder.com/300x200.png?text=Course",
      category: category,
      level: courseData.level || "Beginner",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  // Update course
  updateCourse(id, courseData) {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index !== -1) {
      // Normalize category khi update
      if (courseData.category) {
        const validCategories = ["Programming", "Design", "Business"];
        if (!validCategories.includes(courseData.category)) {
          courseData.category = "General";
        }
      }

      this.courses[index] = {
        ...this.courses[index],
        ...courseData,
        updatedAt: new Date().toISOString(),
      };
      return this.courses[index];
    }
    return null;
  }

  // Delete course
  deleteCourse(id) {
    const index = this.courses.findIndex((course) => course.id === id);
    if (index !== -1) {
      const deletedCourse = this.courses[index];
      this.courses.splice(index, 1);
      return deletedCourse;
    }
    return null;
  }

  // Search courses
  searchCourses(query) {
    const lowerQuery = query.toLowerCase();
    return this.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery) ||
        course.instructor.toLowerCase().includes(lowerQuery)
    );
  }

  // Get course statistics
  getCourseStats(instructorName) {
    const instructorCourses = this.getCoursesByInstructor(instructorName);
    const totalStudents = instructorCourses.reduce(
      (sum, course) => sum + course.students,
      0
    );
    const avgRating =
      instructorCourses.length > 0
        ? instructorCourses.reduce((sum, course) => sum + course.rating, 0) /
          instructorCourses.length
        : 0;

    return {
      totalCourses: instructorCourses.length,
      totalStudents,
      averageRating: avgRating.toFixed(1),
    };
  }
}

export default new CourseModel();
