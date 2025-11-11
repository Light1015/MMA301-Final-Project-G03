import React, { useState, useEffect } from "react";
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
import CertificateModel from "../../models/CertificateModel";
import AssignmentController from "../../controllers/AssignmentController";

export default function CourseDetailView({ course, onBack }) {
  const [imageError, setImageError] = useState(false);
  const [courseCertificates, setCourseCertificates] = useState([]);
  const [courseAssignments, setCourseAssignments] = useState([]);

  useEffect(() => {
    if (course?.id) {
      // Get certificates for this course
      const allCerts = CertificateModel.getAllCertificates();
      const filtered = allCerts.filter(cert => Number(cert.courseId) === Number(course.id));
      setCourseCertificates(filtered);

      // Get assignments for this course (only published ones)
      console.log('Course ID:', course.id, typeof course.id);
      const assignmentsResult = AssignmentController.getAssignmentsByCourse(course.id);
      console.log('Assignments Result:', assignmentsResult);
      if (assignmentsResult.success) {
        console.log('All assignments for course:', assignmentsResult.data);
        // Filter only published assignments
        const publishedAssignments = assignmentsResult.data.filter(
          assignment => assignment.status === 'published'
        );
        console.log('Published assignments:', publishedAssignments);
        setCourseAssignments(publishedAssignments);
      }
    }
  }, [course?.id]);
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

  // Get fallback image based on category
  const getFallbackImage = () => {
    switch (finalCategory) {
      case "Programming":
        return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop";
      case "Design":
        return "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop";
      case "Business":
        return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=500&fit=crop";
    }
  };

  const imageUri = imageError
    ? getFallbackImage()
    : course.image || getFallbackImage();

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
            source={{ uri: imageUri }}
            style={styles.courseImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
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

        {/* Course Assignments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Course Assignments</Text>
          </View>

          {courseAssignments.length > 0 ? (
            courseAssignments.map((assignment) => (
              <View key={assignment.id} style={styles.assignmentCard}>
                <View style={styles.assignmentHeader}>
                  <View style={styles.assignmentIcon}>
                    <Ionicons name="clipboard" size={24} color="#4F46E5" />
                  </View>
                  <View style={styles.assignmentInfo}>
                    <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                    <View style={styles.assignmentMeta}>
                      <Ionicons name="person-outline" size={14} color="#6B7280" />
                      <Text style={styles.assignmentInstructor}>
                        {assignment.instructor}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.assignmentStatus,
                    assignment.status === 'published' ? styles.publishedStatus :
                      assignment.status === 'draft' ? styles.draftStatus : styles.closedStatus
                  ]}>
                    <Text style={styles.statusText}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </Text>
                  </View>
                </View>

                {assignment.description && (
                  <Text style={styles.assignmentDescription} numberOfLines={2}>
                    {assignment.description}
                  </Text>
                )}

                <View style={styles.assignmentFooter}>
                  {assignment.dueDate && (
                    <View style={styles.assignmentDetail}>
                      <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                      <Text style={styles.assignmentDetailText}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.assignmentDetail}>
                    <Ionicons name="star-outline" size={16} color="#6B7280" />
                    <Text style={styles.assignmentDetailText}>
                      {assignment.totalPoints || 100} points
                    </Text>
                  </View>
                  {assignment.questions && assignment.questions.length > 0 && (
                    <View style={styles.assignmentDetail}>
                      <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
                      <Text style={styles.assignmentDetailText}>
                        {assignment.questions.length} questions
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noAssignments}>
              <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
              <Text style={styles.noAssignmentsText}>
                No assignments available yet
              </Text>
              <Text style={styles.noAssignmentsSubtext}>
                Assignments will appear here once they are created
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
        {/* Course Certificates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="ribbon" size={24} color="#FFD700" />
            <Text style={styles.sectionTitle}>Course Certificates</Text>
          </View>

          {courseCertificates.length > 0 ? (
            courseCertificates.map((cert) => (
              <View key={cert.id} style={styles.certificateCard}>
                <View style={styles.certificateHeader}>
                  <View style={styles.certificateIcon}>
                    <Ionicons name="shield-checkmark" size={24} color="#FFD700" />
                  </View>
                  <View style={styles.certificateInfo}>
                    <Text style={styles.certificateName}>{cert.certificateName}</Text>
                    <View style={styles.certificateMeta}>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.certificateDate}>
                        Issued: {cert.issueDate || 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.certificateStatus,
                    cert.status === 'active' ? styles.activeStatus : styles.inactiveStatus
                  ]}>
                    <Text style={styles.statusText}>
                      {cert.status === 'active' ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>

                {cert.description && (
                  <Text style={styles.certificateDescription} numberOfLines={2}>
                    {cert.description}
                  </Text>
                )}

                <View style={styles.certificateFooter}>
                  <View style={styles.certificateDetail}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.certificateDetailText}>
                      Valid for: {cert.validityPeriod || 'Lifetime'}
                    </Text>
                  </View>
                  <View style={styles.certificateDetail}>
                    <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                    <Text style={styles.certificateDetailText}>
                      Template: {cert.templateDesign || 'Default'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noCertificates}>
              <Ionicons name="ribbon-outline" size={48} color="#D1D5DB" />
              <Text style={styles.noCertificatesText}>
                No certificates available for this course yet
              </Text>
              <Text style={styles.noCertificatesSubtext}>
                Complete the course to earn your certificate
              </Text>
            </View>
          )}
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

  certificateCard: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  certificateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  certificateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  certificateMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  certificateDate: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 4,
  },
  certificateStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: "#D1FAE5",
  },
  inactiveStatus: {
    backgroundColor: "#FED7AA",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#065F46",
  },
  certificateDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  certificateFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  certificateDetail: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  certificateDetailText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  noCertificates: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noCertificatesText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 12,
  },
  noCertificatesSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  // Assignment Styles
  assignmentCard: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  assignmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  assignmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  assignmentMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  assignmentInstructor: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 4,
  },
  assignmentStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  publishedStatus: {
    backgroundColor: "#D1FAE5",
  },
  draftStatus: {
    backgroundColor: "#FEF3C7",
  },
  closedStatus: {
    backgroundColor: "#FEE2E2",
  },
  assignmentDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
    marginLeft: 60,
  },
  assignmentFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginLeft: 60,
  },
  assignmentDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  assignmentDetailText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  noAssignments: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noAssignmentsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 12,
  },
  noAssignmentsSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
});
