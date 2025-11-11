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
import QuizController from "../../controllers/QuizController";
import { mockQuestionBank } from "../../database/db";

export default function DetailQuizView({ user, quiz, onBack }) {
    const [quizState, setQuizState] = useState(quiz);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectModalVisible, setSelectModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [form, setForm] = useState({
        questionText: "",
        A: "",
        B: "",
        C: "",
        D: "",
        correctAnswer: "A",
    });

    const resetForm = () => setForm({ questionText: "", A: "", B: "", C: "", D: "", correctAnswer: "A" });

    const handleAddQuestion = () => {
        setSearchQuery("");
        setSelectModalVisible(true);
    };

    const handleCreateNew = () => {
        setSelectModalVisible(false);
        setEditMode(false);
        setCurrentQuestion(null);
        resetForm();
        setModalVisible(true);
    };

    const handleSelectQuestion = (question) => {
        const payload = {
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctAnswer,
        };
        const res = QuizController.addQuestion(quizState.id, payload, user.name);
        if (res.success) {
            const updated = QuizController.getQuizById(quizState.id);
            if (updated.success) setQuizState(updated.data);
            showAlert("Success", "Question added to quiz");
            setSelectModalVisible(false);
        } else {
            showAlert("Error", res.error);
        }
    };

    const handleEditQuestion = (question) => {
        setEditMode(true);
        setCurrentQuestion(question);
        const opts = question.options || {};
        setForm({
            questionText: question.questionText || question.text || "",
            A: opts.A || "",
            B: opts.B || "",
            C: opts.C || "",
            D: opts.D || "",
            correctAnswer: question.correctAnswer || "A",
        });
        setModalVisible(true);
    };

    const submitQuestion = () => {
        const payload = {
            questionText: form.questionText,
            options: { A: form.A, B: form.B, C: form.C, D: form.D },
            correctAnswer: form.correctAnswer,
        };
        let res;
        if (editMode && currentQuestion) {
            res = QuizController.updateQuestion(quizState.id, currentQuestion.id, payload, user.name);
        } else {
            res = QuizController.addQuestion(quizState.id, payload, user.name);
        }
        if (res.success) {
            const updated = QuizController.getQuizById(quizState.id);
            if (updated.success) setQuizState(updated.data);
            showAlert("Success", res.message);
            setModalVisible(false);
            resetForm();
        } else {
            showAlert("Error", res.error);
        }
    };

    const handleDeleteQuestion = (question) => {
        const qText = question.questionText || question.text || "this question";
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
        const res = QuizController.deleteQuestion(quizState.id, qid, user.name);
        if (res.success) {
            const updated = QuizController.getQuizById(quizState.id);
            if (updated.success) setQuizState(updated.data);
            showAlert("Success", res.message);
        } else {
            showAlert("Error", res.error);
        }
    };

    const showAlert = (title, message) => {
        if (Platform.OS === "web") alert(`${title}: ${message}`);
        else Alert.alert(title, message);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name="help-circle" size={24} color="#4F46E5" />
                    <Text style={styles.headerTitle}>{quizState.title}</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Table */}
            <ScrollView style={styles.tableContainer}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <View style={[styles.tableCell, styles.questionCell]}>
                        <Text style={styles.headerText}>Question</Text>
                    </View>
                    <View style={[styles.tableCell, styles.answerCell]}>
                        <Text style={styles.headerText}>Answer</Text>
                    </View>
                    <View style={[styles.tableCell, styles.actionsCell]}>
                        <Text style={styles.headerText}>Actions</Text>
                    </View>
                </View>

                {/* Table Rows */}
                {(!quizState.questions || quizState.questions.length === 0) ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No questions yet</Text>
                    </View>
                ) : (
                    quizState.questions.map((qq, index) => {
                        const opts = qq.options || {};
                        return (
                            <View key={qq.id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                                <View style={[styles.tableCell, styles.questionCell]}>
                                    <Text style={styles.cellText} numberOfLines={2}>
                                        {qq.questionText || qq.text}
                                    </Text>
                                </View>
                                <View style={[styles.tableCell, styles.answerCell]}>
                                    <View style={styles.answerBadge}>
                                        <Text style={styles.answerText}>{qq.correctAnswer || "-"}</Text>
                                    </View>
                                </View>
                                <View style={[styles.tableCell, styles.actionsCell]}>
                                    <TouchableOpacity onPress={() => handleEditQuestion(qq)} style={styles.iconButton}>
                                        <Ionicons name="create-outline" size={20} color="#F59E0B" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteQuestion(qq)} style={styles.iconButton}>
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* Select Question Modal */}
            <Modal visible={selectModalVisible} animationType="slide" transparent={true} onRequestClose={() => setSelectModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Question</Text>
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
                                    placeholder="Search questions..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>

                            {/* Create New Button */}
                            <TouchableOpacity style={styles.createNewButton} onPress={handleCreateNew}>
                                <Ionicons name="add-circle" size={24} color="#4F46E5" />
                                <Text style={styles.createNewText}>Create New Question</Text>
                            </TouchableOpacity>

                            {/* Question List */}
                            <ScrollView style={styles.questionList}>
                                <Text style={styles.sectionTitle}>Select from Question Bank</Text>
                                {mockQuestionBank
                                    .filter(q =>
                                        searchQuery.trim() === "" ||
                                        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        q.category.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((question) => (
                                        <TouchableOpacity
                                            key={question.id}
                                            style={styles.questionItem}
                                            onPress={() => handleSelectQuestion(question)}
                                        >
                                            <View style={styles.questionItemLeft}>
                                                <Ionicons name="help-circle-outline" size={20} color="#4F46E5" />
                                                <View style={styles.questionItemContent}>
                                                    <Text style={styles.questionItemText} numberOfLines={2}>
                                                        {question.questionText}
                                                    </Text>
                                                    <Text style={styles.questionItemCategory}>{question.category}</Text>
                                                </View>
                                            </View>
                                            <Ionicons name="add-circle-outline" size={24} color="#10B981" />
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add/Edit Question Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editMode ? "Edit Question" : "Create New Question"}</Text>
                            <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.formContainer}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Question *</Text>
                                <TextInput style={styles.input} value={form.questionText} onChangeText={(t) => setForm({ ...form, questionText: t })} />
                            </View>
                            {['A', 'B', 'C', 'D'].map((k) => (
                                <View key={k} style={styles.formGroup}>
                                    <Text style={styles.label}>Option {k} *</Text>
                                    <TextInput style={styles.input} value={form[k]} onChangeText={(t) => setForm({ ...form, [k]: t })} />
                                </View>
                            ))}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Correct Answer</Text>
                                <View style={styles.optionsRow}>
                                    {['A', 'B', 'C', 'D'].map((k) => (
                                        <TouchableOpacity key={k} style={[styles.optionButton, form.correctAnswer === k && styles.optionButtonActive]} onPress={() => setForm({ ...form, correctAnswer: k })}>
                                            <Text style={[styles.optionText, form.correctAnswer === k && styles.optionTextActive]}>{k}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setModalVisible(false); resetForm(); }}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={submitQuestion}>
                                    <Text style={styles.submitButtonText}>{editMode ? "Update" : "Add"}</Text>
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
    backButton: {
        padding: 8,
    },
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
    questionCell: {
        width: 280,
    },
    answerCell: {
        width: 100,
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
        maxWidth: 600,
        maxHeight: '80%',
        borderRadius: 12,
        overflow: 'hidden',
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
    createNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF2FF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#4F46E5',
        borderStyle: 'dashed',
    },
    createNewText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#4F46E5',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    questionList: {
        maxHeight: 300,
    },
    questionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    questionItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    questionItemContent: {
        marginLeft: 12,
        flex: 1,
    },
    questionItemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 4,
    },
    questionItemCategory: {
        fontSize: 12,
        color: '#6B7280',
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
    formContainer: {
        padding: 12,
    },
    formGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
    },
    optionButtonActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    optionText: { color: '#6B7280', fontWeight: '700' },
    optionTextActive: { color: '#FFFFFF' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
    modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
    cancelButton: { backgroundColor: '#F3F4F6' },
    submitButton: { backgroundColor: '#10B981' },
    cancelButtonText: { color: '#6B7280', fontWeight: '600' },
    submitButtonText: { color: '#FFFFFF', fontWeight: '600' },
});
