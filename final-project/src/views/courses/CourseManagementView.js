import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CourseController from "../../controllers/CourseController";
import CourseDetailView from "./CourseDetailView";

export default function CourseManagementView({ user, onBack }) {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    category: "Programming",
    level: "Beginner",
    image: "",
    whatYouLearn: [],
    content: [],
  });
  const [currentVideoLesson, setCurrentVideoLesson] = useState({
    title: "",
    videoUrl: "",
    duration: "",
  });

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Filter courses based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const result = CourseController.searchCourses(searchQuery);
      if (result.success) {
        // Filter only teacher's courses
        const teacherCourses = result.data.filter(
          (course) => course.instructor === user.name
        );
        setFilteredCourses(teacherCourses);
      }
    }
  }, [searchQuery, courses]);

  const loadCourses = () => {
    // Use email for reliable course fetching
    const result = CourseController.getTeacherCourses(user.email);
    if (result.success) {
      setCourses(result.data);
      setFilteredCourses(result.data);
    }
  };

  const handleCreateCourse = () => {
    setEditMode(false);
    setCurrentCourse(null);
    setFormData({
      title: "",
      description: "",
      duration: "",
      category: "Programming",
      level: "Beginner",
      image: "",
      whatYouLearn: [],
      content: [],
    });
    setModalVisible(true);
  };

  const handleEditCourse = (course) => {
    setEditMode(true);
    setCurrentCourse(course);

    // Normalize category: nếu không phải 3 loại chính thì hiển thị là General
    let displayCategory = course.category || "General";
    const validCategories = ["Programming", "Design", "Business"];
    if (!validCategories.includes(displayCategory)) {
      displayCategory = "General";
    }

    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      category: displayCategory,
      level: course.level || "Beginner",
      image: course.image || "",
      whatYouLearn: course.whatYouLearn || [],
      content: course.content || [],
    });
    setModalVisible(true);
  };

  const handleDeleteCourse = (course) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${course.title}"?`
      );
      if (confirmed) {
        deleteCourse(course.id);
      }
    } else {
      Alert.alert(
        "Delete Course",
        `Are you sure you want to delete "${course.title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteCourse(course.id),
          },
        ]
      );
    }
  };

  const deleteCourse = (courseId) => {
    // Use email for ownership verification
    const result = CourseController.deleteCourse(courseId, user.email);
    if (result.success) {
      loadCourses();
      showAlert("Success", result.message);
    } else {
      showAlert("Error", result.error);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showAlert("Error", "Title and description are required");
      return;
    }

    let result;
    if (editMode && currentCourse) {
      result = CourseController.updateCourse(
        currentCourse.id,
        formData,
        user.email
      );
    } else {
      // For new courses, include email
      result = CourseController.createCourse(
        { ...formData, email: user.email },
        user.email
      );
    }

    if (result.success) {
      setModalVisible(false);
      loadCourses();
      showAlert("Success", result.message);
    } else {
      showAlert("Error", result.error);
    }
  };

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Video Content Management Functions
  const addVideoLesson = () => {
    if (
      !currentVideoLesson.title.trim() ||
      !currentVideoLesson.videoUrl.trim()
    ) {
      showAlert("Error", "Lesson title and video URL are required");
      return;
    }

    setFormData({
      ...formData,
      content: [
        ...formData.content,
        {
          title: currentVideoLesson.title.trim(),
          videoUrl: currentVideoLesson.videoUrl.trim(),
          duration: currentVideoLesson.duration.trim() || "N/A",
        },
      ],
    });

    setCurrentVideoLesson({ title: "", videoUrl: "", duration: "" });
  };

  const removeVideoLesson = (index) => {
    const updated = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: updated });
  };

  const updateVideoLesson = (index, field, value) => {
    const updated = formData.content.map((lesson, i) =>
      i === index ? { ...lesson, [field]: value } : lesson
    );
    setFormData({ ...formData, content: updated });
  };

  const handleViewDetail = (course) => {
    setSelectedCourse(course);
    setShowDetail(true);
  };

  const handleBackFromDetail = () => {
    setShowDetail(false);
    setSelectedCourse(null);
  };

  // Show Course Detail View
  if (showDetail && selectedCourse) {
    return (
      <CourseDetailView course={selectedCourse} onBack={handleBackFromDetail} />
    );
  }

  const renderCourseCard = (course) => (
    <View key={course.id} style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <View style={styles.courseIcon}>
          <Ionicons name="book" size={30} color="#4F46E5" />
        </View>
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription} numberOfLines={2}>
            {course.description}
          </Text>
        </View>
      </View>

      <View style={styles.courseDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{course.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{course.students} students</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.detailText}>{course.rating}</Text>
        </View>
      </View>

      <View style={styles.courseActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleViewDetail(course)}
        >
          <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditCourse(course)}
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteCourse(course)}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Management</Text>
        <TouchableOpacity onPress={handleCreateCourse} style={styles.addButton}>
          <Ionicons name="add-circle" size={32} color="#10B981" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#6B7280"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Course List */}
      <ScrollView
        style={styles.courseList}
        contentContainerStyle={styles.courseListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCourses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No courses found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery
                ? "Try a different search"
                : "Create your first course!"}
            </Text>
          </View>
        ) : (
          filteredCourses.map(renderCourseCard)
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? "Edit Course" : "Create New Course"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Course Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., React Native Basics"
                  value={formData.title}
                  onChangeText={(text) =>
                    setFormData({ ...formData, title: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Course description..."
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 4 weeks"
                  value={formData.duration}
                  onChangeText={(text) =>
                    setFormData({ ...formData, duration: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.helperText}>
                  Note: Select one of the main categories. "General" is for
                  other courses.
                </Text>
                <View style={styles.categoryButtons}>
                  {["Programming", "Design", "Business", "General"].map(
                    (cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryButton,
                          formData.category === cat &&
                            styles.categoryButtonActive,
                        ]}
                        onPress={() =>
                          setFormData({ ...formData, category: cat })
                        }
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            formData.category === cat &&
                              styles.categoryButtonTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Level</Text>
                <View style={styles.levelButtons}>
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.levelButton,
                        formData.level === level && styles.levelButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, level })}
                    >
                      <Text
                        style={[
                          styles.levelButtonText,
                          formData.level === level &&
                            styles.levelButtonTextActive,
                        ]}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Image URL (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://..."
                  value={formData.image}
                  onChangeText={(text) =>
                    setFormData({ ...formData, image: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>What You'll Learn</Text>
                <View style={styles.learnItemsList}>
                  {formData.whatYouLearn.map((item, index) => (
                    <View key={index} style={styles.learnItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10B981"
                      />
                      <Text style={styles.learnItemText}>{item}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          const updated = formData.whatYouLearn.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, whatYouLearn: updated });
                        }}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.addLearnItemContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Add a learning outcome..."
                    onSubmitEditing={(e) => {
                      const text = e.nativeEvent.text.trim();
                      if (text) {
                        setFormData({
                          ...formData,
                          whatYouLearn: [...formData.whatYouLearn, text],
                        });
                        e.target.clear();
                      }
                    }}
                  />
                  <Text style={styles.helperText}>Press Enter to add item</Text>
                </View>
              </View>

              {/* Video Content Section */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Course Content (Video Lessons)</Text>
                <View style={styles.videoLessonsList}>
                  {formData.content.map((lesson, index) => (
                    <View key={index} style={styles.videoLessonCard}>
                      <View style={styles.videoLessonHeader}>
                        <Ionicons
                          name="play-circle"
                          size={24}
                          color="#4F46E5"
                        />
                        <Text style={styles.videoLessonNumber}>
                          Lesson {index + 1}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeVideoLesson(index)}
                          style={styles.deleteVideoButton}
                        >
                          <Ionicons name="trash" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={[styles.input, styles.videoInput]}
                        placeholder="Lesson title"
                        value={lesson.title}
                        onChangeText={(text) =>
                          updateVideoLesson(index, "title", text)
                        }
                      />
                      <TextInput
                        style={[styles.input, styles.videoInput]}
                        placeholder="YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                        value={lesson.videoUrl}
                        onChangeText={(text) =>
                          updateVideoLesson(index, "videoUrl", text)
                        }
                      />
                      <TextInput
                        style={[styles.input, styles.videoInput]}
                        placeholder="Duration (e.g., 15:30)"
                        value={lesson.duration}
                        onChangeText={(text) =>
                          updateVideoLesson(index, "duration", text)
                        }
                      />
                    </View>
                  ))}
                </View>

                {/* Add New Video Lesson */}
                <View style={styles.addVideoContainer}>
                  <Text style={styles.addVideoTitle}>Add New Video Lesson</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Lesson title"
                    value={currentVideoLesson.title}
                    onChangeText={(text) =>
                      setCurrentVideoLesson({
                        ...currentVideoLesson,
                        title: text,
                      })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="YouTube URL"
                    value={currentVideoLesson.videoUrl}
                    onChangeText={(text) =>
                      setCurrentVideoLesson({
                        ...currentVideoLesson,
                        videoUrl: text,
                      })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Duration (optional)"
                    value={currentVideoLesson.duration}
                    onChangeText={(text) =>
                      setCurrentVideoLesson({
                        ...currentVideoLesson,
                        duration: text,
                      })
                    }
                  />
                  <TouchableOpacity
                    style={styles.addVideoButton}
                    onPress={addVideoLesson}
                  >
                    <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.addVideoButtonText}>Add Lesson</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>
                    {editMode ? "Update" : "Create"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  courseList: {
    flex: 1,
  },
  courseListContent: {
    padding: 16,
    paddingTop: 0,
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  courseIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  courseDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#6B7280",
  },
  courseActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: "#10B981",
  },
  editButton: {
    backgroundColor: "#4F46E5",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    maxHeight: "80%",
    ...Platform.select({
      web: {
        maxHeight: "90vh",
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  categoryButtonActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  categoryButtonTextActive: {
    color: "#FFFFFF",
  },
  levelButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginHorizontal: 4,
    alignItems: "center",
  },
  levelButtonActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  levelButtonTextActive: {
    color: "#FFFFFF",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  submitButton: {
    backgroundColor: "#10B981",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  learnItemsList: {
    marginBottom: 12,
  },
  learnItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  learnItemText: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
  },
  addLearnItemContainer: {
    gap: 4,
  },
  // Video Content Styles
  videoLessonsList: {
    marginBottom: 16,
  },
  videoLessonCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  videoLessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  videoLessonNumber: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  deleteVideoButton: {
    padding: 4,
  },
  videoInput: {
    marginBottom: 8,
  },
  addVideoContainer: {
    backgroundColor: "#EEF2FF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#4F46E5",
  },
  addVideoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 12,
  },
  addVideoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  addVideoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
