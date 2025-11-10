import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert,
    Platform,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AssignmentController from "../../controllers/AssignmentController";
import QuizController from "../../controllers/QuizController";

export default function DetailAssignmentView({ user, assignment, onBack }) {
    const [assignmentState, setAssignmentState] = useState(assignment);
    const [selectModalVisible, setSelectModalVisible] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    React.useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = () => {
        const res = QuizController.getTeacherQuizzes(user.name);
        if (res.success) {
            setQuizzes(res.data);
        }
    };

    const refreshAssignment = () => {
        const res = AssignmentController.getAssignmentById(assignmentState.id);
        if (res.success) {
            setAssignmentState(res.data);
        }
    };

    const handleAddQuestions = () => {
        setSearchQuery("");
        setSelectedQuiz(null);
        setSelectModalVisible(true);
    };

    const handleSelectWholeQuiz = (quiz) => {
        const questions = quiz.questions.map(q => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: 10,
            sourceQuizId: quiz.id,
            sourceQuestionId: q.id,
        }));

        const res = AssignmentController.addQuestionsToAssignment(assignmentState.id, questions, user.name);
        if (res.success) {
            refreshAssignment();
            showAlert("Success", `Added ${questions.length} questions from ${quiz.title}`);
            setSelectModalVisible(false);
        } else {
            showAlert("Error", res.error);
        }
    };

    const handleSelectQuestion = (quiz, question) => {
        const questions = [{
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctAnswer,
            points: 10,
            sourceQuizId: quiz.id,
            sourceQuestionId: question.id,
        }];

        const res = AssignmentController.addQuestionsToAssignment(assignmentState.id, questions, user.name);
        if (res.success) {
            refreshAssignment();
            showAlert("Success", "Question added successfully");
        } else {
            showAlert("Error", res.error);
        }
    };

    const handleDeleteQuestion = (question) => {
        const qText = question.questionText || "this question";
        if (Platform.OS === "web") {
            if (!window.confirm(`Delete question: ${qText}?`)) return;
        } else {
            Alert.alert("Delete Question", `Delete question: ${qText}?`, [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => doDelete(question.id) },
            ]);
            return;
        }
        doDelete(question.id);
    };

    const doDelete = (qid) => {
        const res = AssignmentController.removeQuestionFromAssignment(assignmentState.id, qid, user.name);
        if (res.success) {
            refreshAssignment();
            showAlert("Success", res.message);
        } else {
            showAlert("Error", res.error);
        }
    };

    const handleChangeStatus = (newStatus) => {
        const res = AssignmentController.updateStatus(assignmentState.id, newStatus, user.name);
        if (res.success) {
            refreshAssignment();
            showAlert("Success", res.message);
        } else {
            showAlert("Error", res.error);
        }
    };

    const showAlert = (title, message) => {
        if (Platform.OS === "web") alert(`${title}: ${message}`);
        else Alert.alert(title, message);
    };

    const filteredQuizzes = quizzes.filter(q =>
        searchQuery.trim() === "" ||
        (q.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.courseName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name="document-text" size={24} color="#4F46E5" />
                    <Text style={styles.headerTitle}>{assignmentState.title}</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddQuestions}>
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Info Bar */}
            <View style={styles.infoBar}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Course:</Text>
                    <Text style={styles.infoValue}>{assignmentState.courseName}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Due:</Text>
                    <Text style={styles.infoValue}>{assignmentState.dueDate || "No deadline"}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <View style={styles.statusButtons}>
                        {["draft", "published", "closed"].map(status => (
                            <TouchableOpacity
                                key={status}
                                style={[
                                    styles.statusBtn,
                                    assignmentState.status === status && styles.statusBtnActive,
                                    status === "published" && styles.statusBtnPublished,
                                    status === "closed" && styles.statusBtnClosed,
                                ]}
                                onPress={() => handleChangeStatus(status)}
                            >
                                <Text style={[
                                    styles.statusBtnText,
                                    assignmentState.status === status && styles.statusBtnTextActive
                                ]}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            {/* Table */}
            <ScrollView style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <View style={[styles.tableCell, styles.questionCell]}>
                        <Text style={styles.headerText}>Question</Text>
                    </View>
                    <View style={[styles.tableCell, styles.optionsCell]}>
                        <Text style={styles.headerText}>Options (A/B/C/D)</Text>
                    </View>
                    <View style={[styles.tableCell, styles.answerCell]}>
                        <Text style={styles.headerText}>Answer</Text>
                    </View>
                    <View style={[styles.tableCell, styles.pointsCell]}>
                        <Text style={styles.headerText}>Points</Text>
                    </View>
                    <View style={[styles.tableCell, styles.actionsCell]}>
                        <Text style={styles.headerText}>Actions</Text>
                    </View>
                </View>

                {(!assignmentState.questions || assignmentState.questions.length === 0) ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No questions yet. Add questions from quizzes.</Text>
                    </View>
                ) : (
                    assignmentState.questions.map((qq, index) => {
                        const opts = qq.options || {};
                        return (
                            <View key={qq.id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                                <View style={[styles.tableCell, styles.questionCell]}>
                                    <Text style={styles.cellText} numberOfLines={2}>
                                        {qq.questionText}
                                    </Text>
                                </View>
                                <View style={[styles.tableCell, styles.optionsCell]}>
                                    <Text style={styles.optionsText} numberOfLines={2}>
                                        A: {opts.A || "-"} | B: {opts.B || "-"} | C: {opts.C || "-"} | D: {opts.D || "-"}
                                    </Text>
                                </View>
                                <View style={[styles.tableCell, styles.answerCell]}>
                                    <View style={styles.answerBadge}>
                                        <Text style={styles.answerText}>{qq.correctAnswer || "-"}</Text>
                                    </View>
                                </View>
                                <View style={[styles.tableCell, styles.pointsCell]}>
                                    <Text style={styles.cellText}>{qq.points || 10}</Text>
                                </View>
                                <View style={[styles.tableCell, styles.actionsCell]}>
                                    <TouchableOpacity onPress={() => handleDeleteQuestion(qq)} style={styles.iconButton}>
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* Select Questions Modal */}
            <Modal visible={selectModalVisible} animationType="slide" transparent={true} onRequestClose={() => setSelectModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Questions from Quizzes</Text>
                            <TouchableOpacity onPress={() => setSelectModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.selectContainer}>
                            {/* Search Bar */}
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search quizzes..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>

                            {/* Quiz List */}
                            <ScrollView style={styles.quizList}>
                                <Text style={styles.sectionTitle}>Select Quiz or Individual Questions</Text>
                                {filteredQuizzes.map((quiz) => (
                                    <View key={quiz.id} style={styles.quizItem}>
                                        <View style={styles.quizHeader}>
                                            <View style={styles.quizHeaderLeft}>
                                                <Ionicons name="folder-open" size={20} color="#4F46E5" />
                                                <View style={styles.quizHeaderContent}>
                                                    <Text style={styles.quizTitle}>{quiz.title}</Text>
                                                    <Text style={styles.quizMeta}>
                                                        {quiz.courseName} • {quiz.questions?.length || 0} questions
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.addAllButton}
                                                onPress={() => handleSelectWholeQuiz(quiz)}
                                            >
                                                <Ionicons name="add-circle" size={20} color="#10B981" />
                                                <Text style={styles.addAllText}>Add All</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {selectedQuiz === quiz.id && quiz.questions && quiz.questions.length > 0 && (
                                            <View style={styles.questionsList}>
                                                {quiz.questions.map((q) => (
                                                    <TouchableOpacity
                                                        key={q.id}
                                                        style={styles.questionItemInModal}
                                                        onPress={() => handleSelectQuestion(quiz, q)}
                                                    >
                                                        <Text style={styles.questionTextInModal} numberOfLines={1}>
                                                            {q.questionText}
                                                        </Text>
                                                        <Ionicons name="add-circle-outline" size={20} color="#10B981" />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}

                                        {quiz.questions && quiz.questions.length > 0 && (
                                            <TouchableOpacity
                                                style={styles.expandButton}
                                                onPress={() => setSelectedQuiz(selectedQuiz === quiz.id ? null : quiz.id)}
                                            >
                                                <Text style={styles.expandText}>
                                                    {selectedQuiz === quiz.id ? "Hide" : "Show"} Questions
                                                </Text>
                                                <Ionicons
                                                    name={selectedQuiz === quiz.id ? "chevron-up" : "chevron-down"}
                                                    size={16}
                                                    color="#4F46E5"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
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
    infoBar: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    infoItem: {
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    statusButtons: {
        flexDirection: 'row',
        marginTop: 4,
    },
    statusBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 2,
    },
    statusBtnActive: {
        backgroundColor: '#6B7280',
    },
    statusBtnPublished: {},
    statusBtnClosed: {},
    statusBtnText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
    },
    statusBtnTextActive: {
        color: '#FFFFFF',
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
    questionCell: { width: 160 },
    optionsCell: { width: 180 },
    answerCell: {
        width: 80,
        alignItems: 'center',
    },
    pointsCell: {
        width: 80,
        alignItems: 'center',
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
    headerText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    cellText: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    },
    optionsText: {
        fontSize: 13,
        color: '#6B7280',
    },
    answerBadge: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    answerText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        maxWidth: 700,
        maxHeight: '80%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    selectContainer: {
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
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
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    quizList: {
        maxHeight: 400,
    },
    quizItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 12,
    },
    quizHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    quizHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    quizHeaderContent: {
        marginLeft: 12,
        flex: 1,
    },
    quizTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    quizMeta: {
        fontSize: 12,
        color: '#6B7280',
    },
    addAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    addAllText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '600',
        color: '#10B981',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 8,
    },
    expandText: {
        fontSize: 13,
        color: '#4F46E5',
        fontWeight: '600',
        marginRight: 4,
    },
    questionsList: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 8,
    },
    questionItemInModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 6,
        marginBottom: 6,
    },
    questionTextInModal: {
        fontSize: 13,
        color: '#1F2937',
        flex: 1,
        marginRight: 8,
    },
});
