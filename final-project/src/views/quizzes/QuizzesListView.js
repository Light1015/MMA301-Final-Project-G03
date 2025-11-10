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
import QuizController from "../../controllers/QuizController";
import DetailQuizView from "./DetailQuizView";

export default function QuizzesListView({ user, onBack }) {
    const [quizzes, setQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [formData, setFormData] = useState({
        title: "",
        courseName: "",
        description: "",
    });

    useEffect(() => {
        loadQuizzes();
    }, []);

    useEffect(() => {
        filterAndSortQuizzes();
    }, [quizzes, searchQuery, sortBy]);

    const loadQuizzes = () => {
        const res = QuizController.getTeacherQuizzes(user.name);
        if (res.success) {
            setQuizzes(res.data);
            setFilteredQuizzes(res.data);
        }
    };

    const filterAndSortQuizzes = () => {
        let result = [...quizzes];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(q =>
                (q.title || "").toLowerCase().includes(query) ||
                (q.courseName || "").toLowerCase().includes(query)
            );
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            } else if (sortBy === "oldest") {
                return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            }
            return 0;
        });

        setFilteredQuizzes(result);
        setCurrentPage(1);
    };

    const getStatusBadge = (quiz) => {
        const qCount = quiz.questions ? quiz.questions.length : 0;
        if (qCount === 0) return { label: "Inactive", color: "#EF4444" };
        if (qCount < 5) return { label: "Active", color: "#10B981" };
        return { label: "Done", color: "#6366F1" };
    };

    const handleCreateQuiz = () => {
        setEditMode(false);
        setCurrentQuiz(null);
        setFormData({ title: "", courseName: "", description: "" });
        setModalVisible(true);
    };

    const handleEditQuiz = (quiz) => {
        setEditMode(true);
        setCurrentQuiz(quiz);
        setFormData({
            title: quiz.title || "",
            courseName: quiz.courseName || "",
            description: quiz.description || "",
        });
        setModalVisible(true);
    };

    const handleSubmit = () => {
        if (!formData.title.trim()) {
            showAlert("Error", "Title is required");
            return;
        }
        let result;
        if (editMode && currentQuiz) {
            result = QuizController.updateQuiz(currentQuiz.id, formData, user.name);
        } else {
            result = QuizController.createQuiz(formData, user.name);
        }
        if (result.success) {
            setModalVisible(false);
            loadQuizzes();
            showAlert("Success", result.message);
        } else {
            showAlert("Error", result.error);
        }
    };

    const handleDelete = (quiz) => {
        if (Platform.OS === "web") {
            if (!window.confirm(`Delete quiz "${quiz.title}"?`)) return;
        } else {
            Alert.alert("Delete Quiz", `Delete quiz "${quiz.title}"?`, [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => doDelete(quiz.id) },
            ]);
            return;
        }
        doDelete(quiz.id);
    };

    const doDelete = (id) => {
        const res = QuizController.deleteQuiz(id, user.name);
        if (res.success) {
            loadQuizzes();
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

    if (showDetail && selectedQuiz) {
        return (
            <DetailQuizView
                user={user}
                quiz={selectedQuiz}
                onBack={() => {
                    setShowDetail(false);
                    setSelectedQuiz(null);
                    loadQuizzes();
                }}
            />
        );
    }

    // Pagination
    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentQuizzes = filteredQuizzes.slice(startIndex, endIndex);

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </View>

            {/* Main Header */}
            <View style={styles.mainHeader}>
                <View style={styles.headerLeft}>
                    <Ionicons name="folder-open" size={28} color="#4F46E5" />
                    <Text style={styles.headerTitle}>My Quizzes</Text>
                </View>
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
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <View style={[styles.tableCell, styles.nameCell]}>
                        <Text style={styles.headerText}>Quiz Name</Text>
                    </View>
                    <View style={[styles.tableCell, styles.courseCell]}>
                        <Text style={styles.headerText}>Course</Text>
                    </View>
                    <View style={[styles.tableCell, styles.dateCell]}>
                        <Text style={styles.headerText}>Date Added</Text>
                    </View>
                    <View style={[styles.tableCell, styles.questionsCell]}>
                        <Text style={styles.headerText}>Questions</Text>
                    </View>
                    <View style={[styles.tableCell, styles.actionsCell]}>
                        <Text style={styles.headerText}>Actions</Text>
                    </View>
                </View>

                {/* Table Rows */}
                {currentQuizzes.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No quizzes found</Text>
                    </View>
                ) : (
                    currentQuizzes.map((q, index) => {
                        const status = getStatusBadge(q);
                        const qCount = q.questions ? q.questions.length : 0;
                        return (
                            <TouchableOpacity
                                key={q.id}
                                style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}
                                onPress={() => { setSelectedQuiz(q); setShowDetail(true); }}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.tableCell, styles.nameCell]}>
                                    <Text style={styles.fileName}>{q.title}</Text>
                                </View>
                                <View style={[styles.tableCell, styles.courseCell]}>
                                    <Text style={styles.cellText}>{q.courseName || "-"}</Text>
                                </View>
                                <View style={[styles.tableCell, styles.dateCell]}>
                                    <Text style={styles.cellText}>
                                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "-"}
                                    </Text>
                                </View>
                                <View style={[styles.tableCell, styles.questionsCell]}>
                                    <Text style={styles.cellText}>{qCount}</Text>
                                </View>

                                <View style={[styles.tableCell, styles.actionsCell]}>
                                    <TouchableOpacity
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleEditQuiz(q);
                                        }}
                                        style={styles.iconButton}
                                    >
                                        <Ionicons name="create-outline" size={20} color="#F59E0B" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleDelete(q);
                                        }}
                                        style={styles.iconButton}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>

            {/* Pagination */}
            <View style={styles.pagination}>
                <Text style={styles.paginationText}>
                    Showing data {startIndex + 1} to {Math.min(endIndex, filteredQuizzes.length)} of {filteredQuizzes.length} entries
                </Text>
                <View style={styles.paginationButtons}>
                    <TouchableOpacity
                        style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                        onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? "#D1D5DB" : "#4F46E5"} />
                    </TouchableOpacity>
                    {[...Array(totalPages)].map((_, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.pageButton, currentPage === i + 1 && styles.pageButtonActive]}
                            onPress={() => setCurrentPage(i + 1)}
                        >
                            <Text style={[styles.pageButtonText, currentPage === i + 1 && styles.pageButtonTextActive]}>
                                {i + 1}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                        onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <Ionicons name="chevron-forward" size={16} color={currentPage === totalPages ? "#D1D5DB" : "#4F46E5"} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab} onPress={handleCreateQuiz}>
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Create/Edit Quiz Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editMode ? "Edit Quiz" : "Create Quiz"}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.formContainer}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Title *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., JavaScript Basics Quiz"
                                    value={formData.title}
                                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Course Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., Advanced JavaScript"
                                    value={formData.courseName}
                                    onChangeText={(text) => setFormData({ ...formData, courseName: text })}
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Quiz description..."
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                    multiline
                                    numberOfLines={4}
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
    topHeader: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#4F46E5',
        fontWeight: '600',
    },
    mainHeader: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 12,
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
    searchIcon: {
        marginRight: 8,
    },
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
    nameCell: {
        width: 150,
    },
    courseCell: {
        width: 150,
    },
    dateCell: {
        width: 100,
    },
    questionsCell: {
        width: 60,
        alignItems: 'center',
    },
    actionsCell: {
        width: 120,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButton: {
        padding: 6,
        marginHorizontal: 4,
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
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
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
    fab: {
        position: 'absolute',
        bottom: 84,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
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
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
    modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
    cancelButton: { backgroundColor: '#F3F4F6' },
    submitButton: { backgroundColor: '#10B981' },
    cancelButtonText: { color: '#6B7280', fontWeight: '600' },
    submitButtonText: { color: '#FFFFFF', fontWeight: '600' },
});
