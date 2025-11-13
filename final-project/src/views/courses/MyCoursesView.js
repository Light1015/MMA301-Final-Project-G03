import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EnrollmentModel from "../../models/EnrollmentModel";
import FeedbackModel from "../../models/FeedbackModel";
import AssignmentSubmissionModel from "../../models/AssignmentSubmissionModel";
import { mockCourses } from "../../database/collections/courses";

export default function MyCoursesView({
  user,
  onBack,
  selectedCourseId,
  onClearSelectedCourse,
  onNavigateToCourseAssignments,
  refreshToken = 0,
}) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: "" });
  const [editingFeedback, setEditingFeedback] = useState(null);

  useEffect(() => {
    loadEnrollments();
  }, [refreshToken]);

  // Removed auto-open feedback modal - let users manually open feedback

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await EnrollmentModel.getUserEnrollments(user.email);

      // Sync progress with actual assignment completion for ALL courses
      for (const enrollment of data) {
        // Get actual completion rate from assignments
        const rate = await AssignmentSubmissionModel.getCourseCompletionRate(
          enrollment.courseId,
          user.email
        );

        // Normalize percentage to integer 0-100
        const normalized = Number.isFinite(rate.percentage)
          ? Math.min(100, Math.max(0, Math.round(rate.percentage)))
          : 0;

        // If progress is different from actual completion rate, update it
        if (Number(enrollment.progress) !== normalized) {
          await EnrollmentModel.updateEnrollmentProgress(enrollment.id, normalized);
          enrollment.progress = normalized; // Update local data
        } else {
          // Ensure local enrollment.progress is a number and clamped
          enrollment.progress = Math.min(100, Math.max(0, Number(enrollment.progress) || 0));
        }
      }

      setEnrollments(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const getCourseDetails = (courseId) => {
    return mockCourses.find((c) => c.id === courseId);
  };

  const courseHasAssignments = (courseId) => {
    // Dynamic import to get fresh data
    const { mockAssignments: assignments } = require('../../database/collections/assignments');
    const hasAssignments = assignments.some(
      (a) => a.courseId === courseId && a.status === 'published'
    );
    console.log(`Course ${courseId} has assignments:`, hasAssignments);
    return hasAssignments;
  };

  const handleOpenFeedback = async (enrollment) => {
    setSelectedCourse(enrollment);

    // Check if user already has feedback for this course
    const userFeedbacks = await FeedbackModel.getUserFeedbacks(user.email);
    const existingFeedback = userFeedbacks.find(
      (f) => f.courseId === enrollment.courseId
    );

    if (existingFeedback) {
      setEditingFeedback(existingFeedback);
      setFeedbackData({
        rating: existingFeedback.rating,
        comment: existingFeedback.comment,
      });
    } else {
      setEditingFeedback(null);
      setFeedbackData({ rating: 5, comment: "" });
    }

    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackData.comment.trim()) {
      Alert.alert("Error", "Please enter your feedback comment");
      return;
    }

    try {
      if (editingFeedback) {
        // Update existing feedback
        await FeedbackModel.updateFeedback(editingFeedback.id, feedbackData);
        Alert.alert("Success", "Feedback updated successfully");
      } else {
        // Create new feedback
        await FeedbackModel.createFeedback({
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          courseId: selectedCourse.courseId,
          courseName: selectedCourse.courseName,
          ...feedbackData,
        });
        Alert.alert("Success", "Feedback submitted successfully");
      }

      setShowFeedbackModal(false);
      setSelectedCourse(null);
    } catch (error) {
      Alert.alert("Error", "Failed to submit feedback");
    }
  };

  const handleDeleteFeedback = async () => {
    if (!editingFeedback) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this feedback?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await FeedbackModel.deleteFeedback(editingFeedback.id);
              Alert.alert("Success", "Feedback deleted successfully");
              setShowFeedbackModal(false);
              setSelectedCourse(null);
            } catch (error) {
              Alert.alert("Error", "Failed to delete feedback");
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10B981";
      case "in-progress":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "checkmark-circle";
      case "in-progress":
        return "time";
      default:
        return "school";
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </TouchableOpacity>
          <Text style={styles.title}>My Courses</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.title}>My Courses</Text>
      </View>

      <ScrollView style={styles.content}>
        {enrollments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyText}>No courses enrolled yet</Text>
          </View>
        ) : (
          enrollments.map((enrollment) => {
            const course = getCourseDetails(enrollment.courseId);
            return (
              <View key={enrollment.id} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseName}>
                      {enrollment.courseName}
                    </Text>
                    <Text style={styles.enrollDate}>
                      Enrolled: {enrollment.enrollDate}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(enrollment.status) },
                    ]}
                  >
                    <Ionicons
                      name={getStatusIcon(enrollment.status)}
                      size={16}
                      color="#FFF"
                    />
                    <Text style={styles.statusText}>
                      {enrollment.status.replace("-", " ").toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${enrollment.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {enrollment.progress}%
                  </Text>
                </View>

                {course && (
                  <View style={styles.courseDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{course.duration}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="bar-chart-outline"
                        size={16}
                        color="#6B7280"
                      />
                      <Text style={styles.detailText}>{course.level}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.detailText}>{course.rating}</Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.feedbackButton}
                  onPress={() => handleOpenFeedback(enrollment)}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color="#4F46E5"
                  />
                  <Text style={styles.feedbackButtonText}>Manage Feedback</Text>
                </TouchableOpacity>

                {courseHasAssignments(enrollment.courseId) && (
                  <TouchableOpacity
                    style={styles.assignmentsButton}
                    onPress={() => onNavigateToCourseAssignments?.(enrollment.courseId, enrollment.courseName)}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#10B981"
                    />
                    <Text style={styles.assignmentsButtonText}>View Assignments</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {showFeedbackModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFeedback ? "Edit Feedback" : "Add Feedback"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowFeedbackModal(false);
                  setSelectedCourse(null);
                }}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.courseNameModal}>
              {selectedCourse?.courseName}
            </Text>

            <View style={styles.ratingContainer}>
              <Text style={styles.label}>Rating:</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() =>
                      setFeedbackData({ ...feedbackData, rating: star })
                    }
                  >
                    <Ionicons
                      name={
                        star <= feedbackData.rating ? "star" : "star-outline"
                      }
                      size={32}
                      color="#F59E0B"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Comment:</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Share your thoughts about this course..."
                value={feedbackData.comment}
                onChangeText={(text) =>
                  setFeedbackData({ ...feedbackData, comment: text })
                }
              />
            </View>

            <View style={styles.modalActions}>
              {editingFeedback && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteFeedback}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitFeedback}
              >
                <Text style={styles.submitButtonText}>
                  {editingFeedback ? "Update" : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  enrollDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
    minWidth: 40,
    textAlign: "right",
  },
  courseDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#6B7280",
  },
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  feedbackButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
  assignmentsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D1FAE5",
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  assignmentsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  courseNameModal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
