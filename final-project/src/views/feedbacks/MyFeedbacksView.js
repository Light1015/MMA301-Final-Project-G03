import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FeedbackModel from "../../models/FeedbackModel";

export default function MyFeedbacksView({ user, onBack, onNavigateToCourse }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await FeedbackModel.getUserFeedbacks(user.email);
      setFeedbacks(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseId) => {
    if (onNavigateToCourse) {
      onNavigateToCourse(courseId);
    } else {
      Alert.alert("Info", `Navigate to course ${courseId}`);
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color="#F59E0B"
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </TouchableOpacity>
          <Text style={styles.title}>My Feedbacks</Text>
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
        <Text style={styles.title}>My Feedbacks</Text>
      </View>

      <ScrollView style={styles.content}>
        {feedbacks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyText}>No feedbacks yet</Text>
            <Text style={styles.emptySubtext}>
              Share your thoughts about the courses you've taken
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Ionicons name="chatbubbles" size={24} color="#4F46E5" />
                <Text style={styles.summaryNumber}>{feedbacks.length}</Text>
                <Text style={styles.summaryLabel}>Total Feedbacks</Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="star" size={24} color="#F59E0B" />
                <Text style={styles.summaryNumber}>
                  {(
                    feedbacks.reduce((sum, f) => sum + f.rating, 0) /
                    feedbacks.length
                  ).toFixed(1)}
                </Text>
                <Text style={styles.summaryLabel}>Average Rating</Text>
              </View>
            </View>

            {feedbacks.map((feedback) => (
              <View key={feedback.id} style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseName}>{feedback.courseName}</Text>
                    <View style={styles.ratingRow}>
                      {renderStars(feedback.rating)}
                      <Text style={styles.ratingText}>{feedback.rating}/5</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.comment}>{feedback.comment}</Text>

                <View style={styles.feedbackFooter}>
                  <View style={styles.dateContainer}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#6B7280"
                    />
                    <Text style={styles.dateText}>
                      {feedback.updatedAt !== feedback.createdAt
                        ? `Updated: ${feedback.updatedAt}`
                        : `Posted: ${feedback.createdAt}`}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.editFeedbackButton}
                    onPress={() => handleViewCourse(feedback.courseId)}
                  >
                    <Ionicons name="create-outline" size={16} color="#4F46E5" />
                    <Text style={styles.editFeedbackText}>Edit Feedback</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
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
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackHeader: {
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F59E0B",
  },
  comment: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 12,
  },
  feedbackFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },
  editFeedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  editFeedbackText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
});
