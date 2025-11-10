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

export default function DetailQuizView({ user, quiz, onBack }) {
    const [quizState, setQuizState] = useState(quiz);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
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
        setEditMode(false);
        setCurrentQuestion(null);
        resetForm();
        setModalVisible(true);
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
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{quizState.title}</Text>
                <TouchableOpacity onPress={handleAddQuestion} style={styles.addButton}>
                    <Ionicons name="add-circle" size={32} color="#10B981" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {(!quizState.questions || quizState.questions.length === 0) ? (
                    <View style={styles.empty}><Text style={styles.emptyText}>No questions yet</Text></View>
                ) : (
                    quizState.questions.map((qq) => (
                        <View key={qq.id} style={styles.qcard}>
                            <Text style={styles.qtext}>{qq.questionText || qq.text}</Text>
                            <View style={styles.qactions}>
                                <TouchableOpacity onPress={() => handleEditQuestion(qq)} style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]}>
                                    <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteQuestion(qq)} style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}>
                                    <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
            {/* Add/Edit Question Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editMode ? "Edit Question" : "Add Question"}</Text>
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
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    addButton: { padding: 4 },
    list: { padding: 16 },
    qcard: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
    qtext: { fontSize: 15, fontWeight: '600' },
    qactions: { flexDirection: 'row', marginTop: 8 },
    actionBtn: { padding: 8, borderRadius: 6, marginLeft: 8 },
    empty: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#9CA3AF' },
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
