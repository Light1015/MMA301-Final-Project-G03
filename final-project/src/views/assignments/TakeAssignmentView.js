// View for Learners to take assignments
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockAssignments } from '../../database/collections/assignments';
import AssignmentSubmissionModel from '../../models/AssignmentSubmissionModel';

const TakeAssignmentView = ({ assignmentId, user, onBack, onSubmitted }) => {
    const [assignment, setAssignment] = useState(null);
    const [answers, setAnswers] = useState({});
    const [existingSubmission, setExistingSubmission] = useState(null);

    useEffect(() => {
        loadAssignment();
        checkExistingSubmission();
    }, [assignmentId]);

    const loadAssignment = () => {
        const found = mockAssignments.find((a) => a.id === assignmentId);
        if (found) {
            setAssignment(found);
            // Initialize answers object
            const initialAnswers = {};
            found.questions.forEach((q) => {
                initialAnswers[q.id] = '';
            });
            setAnswers(initialAnswers);
        }
    };

    const checkExistingSubmission = async () => {
        const submission = await AssignmentSubmissionModel.getSubmission(
            assignmentId,
            user.email
        );
        setExistingSubmission(submission);
    };

    const handleSelectAnswer = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const calculateScore = () => {
        let correctCount = 0;
        let totalPoints = 0;

        assignment.questions.forEach((question) => {
            totalPoints += question.points || 10;
            if (answers[question.id] === question.correctAnswer) {
                correctCount += question.points || 10;
            }
        });

        return { score: correctCount, totalPoints };
    };

    const handleSubmit = () => {
        // Check if all questions are answered
        const unanswered = assignment.questions.filter(
            (q) => !answers[q.id] || answers[q.id].trim() === ''
        );

        if (unanswered.length > 0) {
            Alert.alert(
                'Incomplete',
                `Please answer all questions before submitting. (${unanswered.length} unanswered)`,
                [{ text: 'OK' }]
            );
            return;
        }

        Alert.alert(
            'Submit Assignment',
            'Are you sure you want to submit? You cannot change your answers after submission.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Submit',
                    style: 'default',
                    onPress: async () => {
                        const { score, totalPoints } = calculateScore();

                        const submissionData = {
                            assignmentId: assignment.id,
                            courseId: assignment.courseId,
                            courseName: assignment.courseName,
                            userEmail: user.email,
                            userName: user.name,
                            userId: user.id,
                            answers,
                            score,
                            totalPoints,
                            percentage: Math.round((score / totalPoints) * 100),
                        };

                        await AssignmentSubmissionModel.submitAssignment(submissionData);

                        Alert.alert(
                            'Submitted Successfully',
                            `Your score: ${score}/${totalPoints} (${submissionData.percentage}%)`,
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        if (onSubmitted) onSubmitted();
                                        onBack();
                                    },
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    if (!assignment) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Assignment</Text>
                </View>
                <View style={styles.centerContainer}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // If already submitted, show results
    if (existingSubmission) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Assignment Result</Text>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.resultCard}>
                        <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                        <Text style={styles.resultTitle}>Submitted</Text>
                        <Text style={styles.resultScore}>
                            {existingSubmission.score} / {existingSubmission.totalPoints}
                        </Text>
                        <Text style={styles.resultPercentage}>
                            {existingSubmission.percentage}%
                        </Text>
                        <Text style={styles.resultDate}>
                            Submitted on:{' '}
                            {new Date(existingSubmission.submittedAt).toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{assignment.title}</Text>
                        <Text style={styles.description}>{assignment.description}</Text>
                    </View>

                    {assignment.questions.map((question, index) => {
                        const userAnswer = existingSubmission.answers[question.id];
                        const isCorrect = userAnswer === question.correctAnswer;

                        return (
                            <View key={question.id} style={styles.questionCard}>
                                <View style={styles.questionHeader}>
                                    <Text style={styles.questionNumber}>Question {index + 1}</Text>
                                    <View
                                        style={[
                                            styles.resultBadge,
                                            isCorrect ? styles.correctBadge : styles.incorrectBadge,
                                        ]}
                                    >
                                        <Ionicons
                                            name={isCorrect ? 'checkmark' : 'close'}
                                            size={16}
                                            color="#FFF"
                                        />
                                        <Text style={styles.badgeText}>
                                            {isCorrect ? 'Correct' : 'Incorrect'}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.questionText}>{question.questionText}</Text>

                                {Object.entries(question.options).map(([key, value]) => {
                                    const isSelected = userAnswer === key;
                                    const isCorrectOption = key === question.correctAnswer;

                                    return (
                                        <View
                                            key={key}
                                            style={[
                                                styles.optionView,
                                                isSelected && styles.selectedOption,
                                                isCorrectOption && styles.correctOption,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    (isSelected || isCorrectOption) &&
                                                    styles.highlightedText,
                                                ]}
                                            >
                                                {key}. {value}
                                            </Text>
                                            {isCorrectOption && (
                                                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                            )}
                                        </View>
                                    );
                                })}

                                <Text style={styles.pointsText}>
                                    Points: {isCorrect ? question.points : 0} / {question.points}
                                </Text>
                            </View>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Show assignment form
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Take Assignment</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{assignment.title}</Text>
                    <Text style={styles.description}>{assignment.description}</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color="#6B7280" />
                        <Text style={styles.infoText}>Due: {assignment.dueDate}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="trophy-outline" size={20} color="#6B7280" />
                        <Text style={styles.infoText}>
                            Total Points: {assignment.totalPoints}
                        </Text>
                    </View>
                </View>

                {assignment.questions.map((question, index) => (
                    <View key={question.id} style={styles.questionCard}>
                        <Text style={styles.questionNumber}>Question {index + 1}</Text>
                        <Text style={styles.questionText}>{question.questionText}</Text>
                        <Text style={styles.pointsText}>Points: {question.points || 10}</Text>

                        {Object.entries(question.options).map(([key, value]) => (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.option,
                                    answers[question.id] === key && styles.selectedOption,
                                ]}
                                onPress={() => handleSelectAnswer(question.id, key)}
                            >
                                <View
                                    style={[
                                        styles.radio,
                                        answers[question.id] === key && styles.radioSelected,
                                    ]}
                                >
                                    {answers[question.id] === key && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>
                                <Text style={styles.optionText}>
                                    {key}. {value}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                    <Text style={styles.submitButtonText}>Submit Assignment</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    questionCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5',
    },
    questionText: {
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 12,
        lineHeight: 22,
    },
    pointsText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
        fontStyle: 'italic',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 8,
        backgroundColor: '#FAFAFA',
    },
    selectedOption: {
        borderColor: '#4F46E5',
        backgroundColor: '#EEF2FF',
    },
    correctOption: {
        borderColor: '#10B981',
        backgroundColor: '#D1FAE5',
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: '#4F46E5',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4F46E5',
    },
    optionText: {
        fontSize: 14,
        color: '#1F2937',
        flex: 1,
    },
    optionView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 8,
        backgroundColor: '#FAFAFA',
    },
    highlightedText: {
        fontWeight: '600',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 12,
        marginVertical: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    resultCard: {
        backgroundColor: '#FFFFFF',
        padding: 32,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#10B981',
        marginTop: 16,
    },
    resultScore: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        marginTop: 8,
    },
    resultPercentage: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4F46E5',
        marginTop: 4,
    },
    resultDate: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 12,
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    correctBadge: {
        backgroundColor: '#10B981',
    },
    incorrectBadge: {
        backgroundColor: '#EF4444',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
});

export default TakeAssignmentView;
