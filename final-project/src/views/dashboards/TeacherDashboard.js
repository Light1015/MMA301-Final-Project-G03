import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CourseController from "../../controllers/CourseController";

// Import web SCSS only on web builds
if (Platform.OS === "web") {
  try {
    require("../../../styles/dashboards/teacher-dashboard.scss");
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function TeacherDashboard({
  user,
  onNavigateToCourseManagement,
  onNavigateToQuizManagement,
  onNavigateToCourseCatalog,
}) {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    if (user && user.name) {
      loadStats();
    }
  }, [user]);

  const loadStats = () => {
    // Get teacher's courses
    const result = CourseController.getTeacherCourses(user.name);
    if (result.success) {
      const courses = result.data;
      const totalCourses = courses.length;
      const totalStudents = courses.reduce(
        (sum, course) => sum + (course.students || 0),
        0
      );

      setStats({
        totalCourses,
        totalStudents,
      });
    }
  };

  return (
    <View style={styles.dashboard}>
      <Text style={styles.sectionTitle}>Teacher Dashboard</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="book" size={30} color="#4F46E5" />
          <Text style={styles.statNumber}>{stats.totalCourses}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people" size={30} color="#10B981" />
          <Text style={styles.statNumber}>{stats.totalStudents}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document" size={30} color="#F59E0B" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Assignments</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={onNavigateToCourseManagement}
          activeOpacity={0.7}
        >
          <Ionicons name="create" size={40} color="#4F46E5" />
          <Text style={styles.cardTitle}>Course Management</Text>
          <Text style={styles.cardText}>Create, edit, delete courses.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={onNavigateToCourseCatalog}
          activeOpacity={0.7}
        >
          <Ionicons name="library" size={40} color="#10B981" />
          <Text style={styles.cardTitle}>Course Catalog</Text>
          <Text style={styles.cardText}>Browse all courses.</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Ionicons name="analytics" size={40} color="#F59E0B" />
          <Text style={styles.cardTitle}>Student Progress</Text>
          <Text style={styles.cardText}>Monitor performance.</Text>
        </View>
        <TouchableOpacity
          style={styles.card}
          onPress={onNavigateToQuizManagement}
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle" size={40} color="#EF4444" />
          <Text style={styles.cardTitle}>Quiz Management</Text>
          <Text style={styles.cardText}>Create and manage quizzes.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#4F46E5",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4F46E5",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    marginHorizontal: 8,
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  cardTitle: {
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 6,
    textAlign: "center",
    color: "#1F2937",
  },
  cardText: {
    color: "#6B7280",
    textAlign: "center",
  },
});
