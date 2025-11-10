// Assignment Controller - Handles assignment operations

import AssignmentModel from "../models/AssignmentModel";
import { saveData, loadData } from "../database/db";

class AssignmentController {
    constructor() {
        this.initializeAssignments();
    }

    initializeAssignments() {
        const data = loadData();
        AssignmentModel.initAssignments(data.assignments || []);
    }

    // Get all assignments for instructor
    getTeacherAssignments(instructorName) {
        try {
            const assignments = AssignmentModel.getAssignmentsByInstructor(instructorName);
            return { success: true, data: assignments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get assignment by ID
    getAssignmentById(id) {
        try {
            const assignment = AssignmentModel.getAssignmentById(id);
            if (!assignment) {
                return { success: false, error: "Assignment not found" };
            }
            return { success: true, data: assignment };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get assignments by course
    getAssignmentsByCourse(courseId) {
        try {
            const assignments = AssignmentModel.getAssignmentsByCourse(courseId);
            return { success: true, data: assignments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create new assignment
    createAssignment(assignmentData, instructorName) {
        try {
            const newAssignment = AssignmentModel.createAssignment({
                ...assignmentData,
                instructor: instructorName,
            });
            this.saveAssignments();
            return { success: true, data: newAssignment, message: "Assignment created successfully" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Update assignment
    updateAssignment(id, assignmentData, instructorName) {
        try {
            const assignment = AssignmentModel.getAssignmentById(id);
            if (!assignment) {
                return { success: false, error: "Assignment not found" };
            }
            if (assignment.instructor !== instructorName) {
                return { success: false, error: "Unauthorized" };
            }
            const updated = AssignmentModel.updateAssignment(id, assignmentData);
            this.saveAssignments();
            return { success: true, data: updated, message: "Assignment updated successfully" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Delete assignment
    deleteAssignment(id, instructorName) {
        try {
            const assignment = AssignmentModel.getAssignmentById(id);
            if (!assignment) {
                return { success: false, error: "Assignment not found" };
            }
            if (assignment.instructor !== instructorName) {
                return { success: false, error: "Unauthorized" };
            }
            AssignmentModel.deleteAssignment(id);
            this.saveAssignments();
            return { success: true, message: "Assignment deleted successfully" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Add questions to assignment
    addQuestionsToAssignment(assignmentId, questions, instructorName) {
        try {
            const assignment = AssignmentModel.getAssignmentById(assignmentId);
            if (!assignment) {
                return { success: false, error: "Assignment not found" };
            }
            if (assignment.instructor !== instructorName) {
                return { success: false, error: "Unauthorized" };
            }
            const updated = AssignmentModel.addQuestionsToAssignment(assignmentId, questions);
            this.saveAssignments();
            return { success: true, data: updated, message: "Questions added successfully" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Remove question from assignment
    removeQuestionFromAssignment(assignmentId, questionId, instructorName) {
        try {
            const assignment = AssignmentModel.getAssignmentById(assignmentId);
            if (!assignment) {
                return { success: false, error: "Assignment not found" };
            }
            if (assignment.instructor !== instructorName) {
                return { success: false, error: "Unauthorized" };
            }
            AssignmentModel.removeQuestionFromAssignment(assignmentId, questionId);
            this.saveAssignments();
            return { success: true, message: "Question removed successfully" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Update assignment status
    updateStatus(id, status, instructorName) {
        try {
            const assignment = AssignmentModel.getAssignmentById(id);
            if (!assignment) {
                return { success: false, error: "Assignment not found" };
            }
            if (assignment.instructor !== instructorName) {
                return { success: false, error: "Unauthorized" };
            }
            AssignmentModel.updateStatus(id, status);
            this.saveAssignments();
            return { success: true, message: `Assignment ${status} successfully` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Search assignments
    searchAssignments(query) {
        try {
            const assignments = AssignmentModel.searchAssignments(query);
            return { success: true, data: assignments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Save assignments to database
    saveAssignments() {
        const data = loadData();
        data.assignments = AssignmentModel.getAllAssignments();
        saveData(data);
    }
}

export default new AssignmentController();
