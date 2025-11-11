import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CourseController from "../../controllers/CourseController";
import CourseDetailView from "./CourseDetailView";

export default function BrowseCoursesView({ user, onBack, refreshToken = 0 }) {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const categories = ["All", "Programming", "Design", "Business", "General"];
    const levels = ["All", "Beginner", "Intermediate", "Advanced"];

    useEffect(() => {
        loadCourses();
    }, [refreshToken]); // Refresh when token changes

    // Also reload when component becomes visible/active
    useEffect(() => {
        const interval = setInterval(() => {
            // Check if there are new assignments periodically
            loadCourses();
        }, 2000); // Check every 2 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        filterCourses();
    }, [searchQuery, selectedCategory, selectedLevel, courses]);

    const loadCourses = () => {
        const result = CourseController.getAllCourses();
        if (result.success) {
            // Filter courses: Only show courses with published assignments for Learners
            const { mockAssignments } = require('../../database/db');
            const coursesWithAssignments = result.data.filter(course => {
                const hasAssignments = mockAssignments.some(
                    assignment => assignment.courseId === course.id && assignment.status === 'published'
                );
                return hasAssignments;
            });

            setCourses(coursesWithAssignments);
            setFilteredCourses(coursesWithAssignments);
        }
    };

    const filterCourses = () => {
        let filtered = [...courses];

        // Search filter
        if (searchQuery.trim() !== "") {
            const result = CourseController.searchCourses(searchQuery);
            if (result.success) {
                filtered = result.data.filter(course =>
                    courses.some(c => c.id === course.id)
                );
            }
        }

        // Category filter
        if (selectedCategory !== "All") {
            if (selectedCategory === "General") {
                filtered = filtered.filter((course) => {
                    const category = course.category || "General";
                    return !["Programming", "Design", "Business"].includes(category);
                });
            } else {
                filtered = filtered.filter(
                    (course) => course.category === selectedCategory
                );
            }
        }

        // Level filter
        if (selectedLevel !== "All") {
            filtered = filtered.filter((course) => {
                const courseLevel = course.level || "Beginner";
                return courseLevel === selectedLevel;
            });
        }

        setFilteredCourses(filtered);
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
            <CourseDetailView
                course={selectedCourse}
                onBack={handleBackFromDetail}
                user={user}
            />
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
                    <Text style={styles.instructor}>by {course.instructor}</Text>
                </View>
            </View>

            <Text style={styles.courseDescription} numberOfLines={3}>
                {course.description}
            </Text>

            <View style={styles.courseTags}>
                <View style={[styles.tag, styles.categoryTag]}>
                    <Text style={styles.tagText}>{course.category || "General"}</Text>
                </View>
                <View style={[styles.tag, styles.levelTag]}>
                    <Text style={styles.tagText}>{course.level || "Beginner"}</Text>
                </View>
                <View style={[styles.tag, styles.assignmentTag]}>
                    <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    <Text style={[styles.tagText, { marginLeft: 4, color: '#10B981' }]}>Has Assignments</Text>
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

            <TouchableOpacity
                style={styles.enrollButton}
                onPress={() => handleViewDetail(course)}
            >
                <Text style={styles.enrollButtonText}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Browse Courses</Text>
                <TouchableOpacity onPress={loadCourses} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={24} color="#4F46E5" />
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

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterRow}
                    contentContainerStyle={styles.filterContent}
                >
                    <Text style={styles.filterLabel}>Category:</Text>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.filterButton,
                                selectedCategory === category && styles.filterButtonActive,
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    selectedCategory === category &&
                                    styles.filterButtonTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterRow}
                    contentContainerStyle={styles.filterContent}
                >
                    <Text style={styles.filterLabel}>Level:</Text>
                    {levels.map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[
                                styles.filterButton,
                                selectedLevel === level && styles.filterButtonActive,
                            ]}
                            onPress={() => setSelectedLevel(level)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    selectedLevel === level && styles.filterButtonTextActive,
                                ]}
                            >
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Course List */}
            <ScrollView
                style={styles.courseList}
                contentContainerStyle={styles.courseListContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.resultCount}>
                    <Text style={styles.resultCountText}>
                        {filteredCourses.length} course
                        {filteredCourses.length !== 1 ? "s" : ""} available to enroll
                    </Text>
                </View>

                {filteredCourses.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="book-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyStateText}>No courses found</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Try adjusting your filters or search query
                        </Text>
                    </View>
                ) : (
                    filteredCourses.map(renderCourseCard)
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
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    backButton: {
        padding: 8,
    },
    refreshButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        margin: 16,
        marginBottom: 8,
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
    filtersContainer: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 8,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    filterRow: {
        paddingVertical: 8,
    },
    filterContent: {
        paddingHorizontal: 12,
        alignItems: "center",
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginRight: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        marginRight: 8,
    },
    filterButtonActive: {
        backgroundColor: "#4F46E5",
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#6B7280",
    },
    filterButtonTextActive: {
        color: "#FFFFFF",
    },
    courseList: {
        flex: 1,
    },
    courseListContent: {
        padding: 16,
        paddingTop: 0,
    },
    resultCount: {
        marginBottom: 12,
    },
    resultCountText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
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
    instructor: {
        fontSize: 14,
        color: "#6B7280",
    },
    courseDescription: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
        marginBottom: 12,
    },
    courseTags: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 12,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    categoryTag: {
        backgroundColor: "#DBEAFE",
    },
    levelTag: {
        backgroundColor: "#FEF3C7",
    },
    assignmentTag: {
        backgroundColor: "#D1FAE5",
    },
    tagText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#374151",
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
    enrollButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#10B981",
        padding: 12,
        borderRadius: 8,
    },
    enrollButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        marginRight: 8,
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
        textAlign: "center",
    },
});
