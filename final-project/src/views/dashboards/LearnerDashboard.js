import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EnrollmentModel from "../../models/EnrollmentModel";

// Import web SCSS only on web builds
if (Platform.OS === "web") {
  try {
    require("../../../styles/dashboards/learner-dashboard.scss");
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function LearnerDashboard({
  user,
  onNavigateToMyCourses,
  onNavigateToCatalog,
  onNavigateToProfile,
  onNavigateToMyFeedbacks,
}) {
  const [stats, setStats] = useState({
    total: 0,
    enrolled: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const enrollmentStats = await EnrollmentModel.getUserEnrollmentStats(
        user.email
      );
      setStats(enrollmentStats);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  return (
    <View style={styles.dashboard}>
      <Text style={styles.sectionTitle}>My Learning Dashboard</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="school" size={30} color="#4F46E5" />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Enrolled</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={30} color="#10B981" />
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={30} color="#F59E0B" />
          <Text style={styles.statNumber}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={onNavigateToCatalog}>
          <Ionicons name="grid" size={40} color="#4F46E5" />
          <Text style={styles.cardTitle}>Browse Courses</Text>
          <Text style={styles.cardText}>Explore and enroll in courses.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={onNavigateToMyCourses}>
          <Ionicons name="book" size={40} color="#8B5CF6" />
          <Text style={styles.cardTitle}>My Courses</Text>
          <Text style={styles.cardText}>View enrolled courses.</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={onNavigateToProfile}>
          <Ionicons name="person" size={40} color="#10B981" />
          <Text style={styles.cardTitle}>View Profile</Text>
          <Text style={styles.cardText}>Edit your information.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={onNavigateToMyFeedbacks}>
          <Ionicons name="chatbubbles" size={40} color="#F59E0B" />
          <Text style={styles.cardTitle}>My Feedbacks</Text>
          <Text style={styles.cardText}>View your course reviews.</Text>
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
