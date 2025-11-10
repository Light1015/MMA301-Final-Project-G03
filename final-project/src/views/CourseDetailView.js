import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CourseDetailView({ course, onBack }) {
  if (!course) {
    return (
      <View style={styles.container}>
        <Text>Course not found</Text>
      </View>
    );
  }

  // Determine category display (normalize General)
  const displayCategory = course.category || "General";
  const validCategories = ["Programming", "Design", "Business"];
  const finalCategory = validCategories.includes(displayCategory)
    ? displayCategory
    : "General";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                course.image ||
                "https://via.placeholder.com/400x250.png?text=Course",
            }}
            style={styles.courseImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={[styles.badge, getCategoryColor(finalCategory)]}>
              <Text style={styles.badgeText}>{finalCategory}</Text>
            </View>
            <View style={[styles.badge, styles.levelBadge]}>
              <Text style={styles.badgeText}>{course.level || "Beginner"}</Text>
            </View>
          </View>
        </View>

        {/* Course Title & Instructor */}
        <View style={styles.titleSection}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.instructorRow}>
            <Ionicons name="person-circle" size={24} color="#6B7280" />
            <Text style={styles.instructorText}>by {course.instructor}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{course.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="people" size={24} color="#10B981" />
            <Text style={styles.statNumber}>{course.students}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="#4F46E5" />
            <Text style={styles.statNumber}>{course.duration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>About This Course</Text>
          </View>
          <Text style={styles.description}>{course.description}</Text>
        </View>

        {/* Course Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Course Information</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category:</Text>
            <Text style={styles.infoValue}>{finalCategory}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level:</Text>
            <Text style={styles.infoValue}>{course.level || "Beginner"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>{course.duration}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Students Enrolled:</Text>
            <Text style={styles.infoValue}>{course.students} students</Text>
          </View>

          {course.createdAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created:</Text>
              <Text style={styles.infoValue}>
                {new Date(course.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* What You'll Learn Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>What You'll Learn</Text>
          </View>

          <View style={styles.learningItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#10B981"
            />
            <Text style={styles.learningText}>
              Master the fundamentals and advanced concepts
            </Text>
          </View>

          <View style={styles.learningItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#10B981"
            />
            <Text style={styles.learningText}>
              Build real-world projects and applications
            </Text>
          </View>

          <View style={styles.learningItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#10B981"
            />
            <Text style={styles.learningText}>
              Learn industry best practices and techniques
            </Text>
          </View>

          <View style={styles.learningItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#10B981"
            />
            <Text style={styles.learningText}>
              Get hands-on experience with practical exercises
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// Helper function to get category color
const getCategoryColor = (category) => {
  switch (category) {
    case "Programming":
      return { backgroundColor: "#4F46E5" };
    case "Design":
      return { backgroundColor: "#EC4899" };
    case "Business":
      return { backgroundColor: "#F59E0B" };
    default:
      return { backgroundColor: "#10B981" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 16,
      },
    }),
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
    backgroundColor: "#E5E7EB",
  },
  courseImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  levelBadge: {
    backgroundColor: "#6B7280",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  titleSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    lineHeight: 36,
  },
  instructorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  instructorText: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 8,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "600",
  },
  learningItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  learningText: {
    flex: 1,
    fontSize: 15,
    color: "#4B5563",
    marginLeft: 12,
    lineHeight: 22,
  },
  enrollButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
