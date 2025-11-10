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
    const [showDetail, setShowDetail] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        courseName: "",
        description: "",
    });

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = () => {
        const res = QuizController.getTeacherQuizzes(user.name);
        if (res.success) setQuizzes(res.data);
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quiz Management</Text>
                <TouchableOpacity onPress={handleCreateQuiz} style={styles.addButton}>
                    <Ionicons name="add-circle" size={32} color="#10B981" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {quizzes.length === 0 ? (
                    <View style={styles.empty}><Text style={styles.emptyText}>No quizzes yet</Text></View>
                ) : (
                    quizzes.map((q) => (
                        <View key={q.id} style={styles.card}>
                            <View style={styles.cardLeft}>
                                <Ionicons name="clipboard" size={36} color="#4F46E5" />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.title}>{q.title}</Text>
                                    <Text style={styles.sub}>{q.courseName}</Text>
                                </View>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => { setSelectedQuiz(q); setShowDetail(true); }} style={styles.actionBtn}>
                                    <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleEditQuiz(q)} style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]}>
                                    <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(q)} style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}>
                                    <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

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
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
    addButton: { padding: 4 },
    list: { padding: 16 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    cardLeft: { flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: 16, fontWeight: '700' },
    sub: { color: '#6B7280' },
    actions: { flexDirection: 'row' },
    actionBtn: { backgroundColor: '#4F46E5', padding: 10, borderRadius: 8, marginLeft: 8 },
    empty: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#9CA3AF' },
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
