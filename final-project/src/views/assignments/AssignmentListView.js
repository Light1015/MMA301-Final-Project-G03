import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
    Modal,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AssignmentController from "../../controllers/AssignmentController";
import CourseController from "../../controllers/CourseController";
import DetailAssignmentView from "./DetailAssignmentView";

export default function AssignmentListView({ user, onBack }) {
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [courses, setCourses] = useState([]);
    const itemsPerPage = 8;

    const [formData, setFormData] = useState({
        title: "",
        courseId: "",
        courseName: "",
        description: "",
        dueDate: "",
        totalPoints: "100",
        status: "draft",
    });

    useEffect(() => {
        loadAssignments();
        loadCourses();
    }, []);

    useEffect(() => {
        filterAndSortAssignments();
    }, [assignments, searchQuery, sortBy]);

    const loadAssignments = () => {
        const res = AssignmentController.getTeacherAssignments(user.name);
        if (res.success) {
            setAssignments(res.data);
            setFilteredAssignments(res.data);
        }
    };

    const loadCourses = () => {
        const res = CourseController.getTeacherCourses(user.name);
        if (res.success) {
            setCourses(res.data);
        }
    };

    const filterAndSortAssignments = () => {
        let result = [...assignments];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(a =>
                (a.title || "").toLowerCase().includes(query) ||
                (a.courseName || "").toLowerCase().includes(query)
            );
        }

        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            } else if (sortBy === "oldest") {
                return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            }
            return 0;
        });

        setFilteredAssignments(result);
        setCurrentPage(1);
    };

    const getStatusBadge = (assignment) => {
        if (assignment.status === "published") return { color: "#10B981" }; // Green
        if (assignment.status === "draft") return { color: "#9CA3AF" }; // Gray
        if (assignment.status === "closed") return { color: "#EF4444" }; // Red
        return { color: "#D1D5DB" }; // Light Gray
    };

    const handleCreateAssignment = () => {
        setEditMode(false);
        setCurrentAssignment(null);
        setFormData({ title: "", courseId: "", courseName: "", description: "", dueDate: "", totalPoints: "100", status: "draft" });
        setModalVisible(true);
    };

    const handleEditAssignment = (assignment) => {
        setEditMode(true);
        setCurrentAssignment(assignment);
        setFormData({
            title: assignment.title || "",
            courseId: assignment.courseId || "",
            courseName: assignment.courseName || "",
            description: assignment.description || "",
            dueDate: assignment.dueDate || "",
            totalPoints: String(assignment.totalPoints || 100),
            status: assignment.status || "draft",
        });
        setModalVisible(true);
    };

    const handleSubmit = () => {
        if (!formData.title.trim()) {
            showAlert("Error", "Title is required");
            return;
        }

        const selectedCourse = courses.find(c => c.id === parseInt(formData.courseId));
        const payload = {
            ...formData,
            courseName: selectedCourse ? selectedCourse.title : formData.courseName,
            totalPoints: parseInt(formData.totalPoints) || 100,
        };

        let result;
        if (editMode && currentAssignment) {
            result = AssignmentController.updateAssignment(currentAssignment.id, payload, user.name);
        } else {
            result = AssignmentController.createAssignment(payload, user.name);
        }

        if (result.success) {
            setModalVisible(false);
            loadAssignments();
            showAlert("Success", result.message);
        } else {
            showAlert("Error", result.error);
        }
    };

    const handleDelete = (assignment) => {
        if (Platform.OS === "web") {
            if (!window.confirm(`Delete assignment "${assignment.title}"?`)) return;
        } else {
            Alert.alert("Delete Assignment", `Delete assignment "${assignment.title}"?`, [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => doDelete(assignment.id) },
            ]);
            return;
        }
        doDelete(assignment.id);
    };

    const doDelete = (id) => {
        const res = AssignmentController.deleteAssignment(id, user.name);
        if (res.success) {
            loadAssignments();
            showAlert("Success", res.message);
        } else {
            showAlert("Error", res.error);
        }
    };

    const showAlert = (title, message) => {
        if (Platform.OS === "web") {
            alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    if (showDetail && selectedAssignment) {
        return (
            <DetailAssignmentView
                user={user}
                assignment={selectedAssignment}
                onBack={() => {
                    setShowDetail(false);
                    setSelectedAssignment(null);
                    loadAssignments();
                }}
            />
        );
    }

    const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAssignments = filteredAssignments.slice(startIndex, endIndex);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name="document-text" size={24} color="#4F46E5" />
                    <Text style={styles.headerTitle}>Assignment Management</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleCreateAssignment}>
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Search and Sort Bar */}
            <View style={styles.controlBar}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <View style={styles.sortContainer}>
                    <Text style={styles.sortLabel}>Sort by:</Text>
                    <TouchableOpacity
                        style={styles.sortButton}
                        onPress={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
                    >
                        <Text style={styles.sortText}>{sortBy === "newest" ? "Newest" : "Oldest"}</Text>
                        <Ionicons name="chevron-down" size={16} color="#4F46E5" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Table */}
            <ScrollView style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <View style={[styles.tableCell, styles.nameCell]}>
                        <Text style={styles.headerText}>Assignment Name</Text>
                    </View>
                    <View style={[styles.tableCell, styles.courseCell]}>
                        <Text style={styles.headerText}>Course</Text>
                    </View>
                    <View style={[styles.tableCell, styles.dateCell]}>
                        <Text style={styles.headerText}>Due Date</Text>
                    </View>
                    <View style={[styles.tableCell, styles.questionsCell]}>
                        <Text style={styles.headerText}>Ques</Text>
                    </View>
                    <View style={[styles.tableCell, styles.statusCell]}>
                        <Text style={styles.headerText}>Status</Text>
                    </View>
                    <View style={[styles.tableCell, styles.actionsCell]}>
                        <Ionicons name="settings-outline" size={16} color="#9CA3AF" />
                    </View>
                </View>

                {currentAssignments.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No assignments found</Text>
                    </View>
                ) : (
                    currentAssignments.map((a, index) => {
                        const status = getStatusBadge(a);
                        const qCount = a.questions ? a.questions.length : 0;
                        return (
                            <TouchableOpacity
                                key={a.id}
                                style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}
                                onPress={() => { setSelectedAssignment(a); setShowDetail(true); }}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.tableCell, styles.nameCell]}>
                                    <Text style={styles.fileName}>{a.title}</Text>
                                </View>
                                <View style={[styles.tableCell, styles.courseCell]}>
                                    <Text style={styles.cellText}>{a.courseName || "-"}</Text>
                                </View>
                                <View style={[styles.tableCell, styles.dateCell]}>
                                    <Text style={styles.cellText}>
                                        {a.dueDate || "-"}
                                    </Text>
                                </View>
                                <View style={[styles.tableCell, styles.questionsCell]}>
                                    <Text style={styles.cellText}>{qCount}</Text>
                                </View>
                                <View style={[styles.tableCell, styles.statusCell]}>
                                    <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                                </View>
                                <View style={[styles.tableCell, styles.actionsCell]}>
                                    <TouchableOpacity
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleEditAssignment(a);
                                        }}
                                        style={styles.actionButtonEdit}
                                    >
                                        <Ionicons name="create-outline" size={16} color="#FFFFFF" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleDelete(a);
                                        }}
                                        style={styles.actionButtonDelete}
                                    >
                                        <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>

            {/* Pagination */}
            {totalPages > 1 && (
                <View style={styles.pagination}>
                    <Text style={styles.paginationText}>
                        {startIndex + 1}-{Math.min(endIndex, filteredAssignments.length)} of {filteredAssignments.length}
                    </Text>
                    <View style={styles.paginationButtons}>
                        <TouchableOpacity
                            style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? "#D1D5DB" : "#4F46E5"} />
                        </TouchableOpacity>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.pageButton, currentPage === pageNum && styles.pageButtonActive]}
                                    onPress={() => setCurrentPage(pageNum)}
                                >
                                    <Text style={[styles.pageButtonText, currentPage === pageNum && styles.pageButtonTextActive]}>
                                        {pageNum}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                        <TouchableOpacity
                            style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <Ionicons name="chevron-forward" size={16} color={currentPage === totalPages ? "#D1D5DB" : "#4F46E5"} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editMode ? "Edit Assignment" : "Create Assignment"}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.formContainer}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Title *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., Midterm Exam"
                                    value={formData.title}
                                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Course *</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseSelector}>
                                    {courses.map((course) => (
                                        <TouchableOpacity
                                            key={course.id}
                                            style={[styles.courseOption, formData.courseId === String(course.id) && styles.courseOptionActive]}
                                            onPress={() => setFormData({ ...formData, courseId: String(course.id), courseName: course.title })}
                                        >
                                            <Text style={[styles.courseOptionText, formData.courseId === String(course.id) && styles.courseOptionTextActive]}>
                                                {course.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Assignment description..."
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Due Date</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD"
                                    value={formData.dueDate}
                                    onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Total Points</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="100"
                                    value={formData.totalPoints}
                                    onChangeText={(text) => setFormData({ ...formData, totalPoints: text })}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.modalActions}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>{editMode ? "Update" : "Create"}</Text>
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
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: { padding: 8 },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 8,
    },
    addButton: {
        backgroundColor: '#4F46E5',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlBar: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flex: 1,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: { marginRight: 8 },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginRight: 8,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sortText: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '600',
        marginRight: 4,
    },
    tableContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 2,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    tableRowEven: {
        backgroundColor: '#FAFBFC',
    },
    tableCell: {
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    nameCell: { width: 120 },
    courseCell: { width: 100 },
    dateCell: { width: 80 },
    questionsCell: {
        width: 50,
        alignItems: 'center',
    },
    statusCell: {
        width: 60,
        alignItems: 'center',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    actionsCell: {
        width: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButton: {
        padding: 6,
        marginHorizontal: 4,
    },
    actionButtonEdit: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F59E0B',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    actionButtonDelete: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    fileName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    cellText: {
        fontSize: 14,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    paginationText: {
        fontSize: 13,
        color: '#6B7280',
    },
    paginationButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pageButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 2,
        borderRadius: 6,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    pageButtonActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    pageButtonDisabled: {
        opacity: 0.5,
    },
    pageButtonText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    pageButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    empty: {
        padding: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 16,
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#FFFFFF', width: '90%', maxWidth: 600, borderRadius: 12, overflow: 'hidden', maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    formContainer: { padding: 12 },
    formGroup: { marginBottom: 12 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, backgroundColor: '#FFFFFF', fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
    courseSelector: { flexDirection: 'row', marginTop: 8 },
    courseOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        marginRight: 8,
        backgroundColor: '#FFFFFF',
    },
    courseOptionActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    courseOptionText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    courseOptionTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
    modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
    cancelButton: { backgroundColor: '#F3F4F6' },
    submitButton: { backgroundColor: '#10B981' },
    cancelButtonText: { color: '#6B7280', fontWeight: '600' },
    submitButtonText: { color: '#FFFFFF', fontWeight: '600' },
});
