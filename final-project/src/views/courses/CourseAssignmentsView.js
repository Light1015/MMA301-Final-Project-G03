// Course Assignments View for Learners
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockAssignments } from '../../database/collections/assignments';
import { mockCourses } from '../../database/collections/courses';
import AssignmentSubmissionModel from '../../models/AssignmentSubmissionModel';
import CertificateModel from '../../models/CertificateModel';
import EnrollmentModel from '../../models/EnrollmentModel';

const CourseAssignmentsView = ({ courseId, courseName, user, onBack, onTakeAssignment, onViewCertificate }) => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [completionRate, setCompletionRate] = useState(null);
    const [certificate, setCertificate] = useState(null);

    useEffect(() => {
        loadData();
    }, [courseId]);

    const loadData = async () => {
        // Load published assignments for this course
        const courseAssignments = mockAssignments.filter(
            (a) => a.courseId === courseId && a.status === 'published'
        );
        setAssignments(courseAssignments);

        // Load user submissions
        const userSubmissions = await AssignmentSubmissionModel.getCourseSubmissions(
            courseId,
            user.email
        );
        setSubmissions(userSubmissions);

        // Check completion rate
        const rate = await AssignmentSubmissionModel.getCourseCompletionRate(
            courseId,
            user.email
        );
        setCompletionRate(rate);

        // Update enrollment progress to sync with assignments
        const enrollments = await EnrollmentModel.getUserEnrollments(user.email);
        const enrollment = enrollments.find((e) => e.courseId === courseId);
        if (enrollment) {
            // Always sync progress with completion rate
            await EnrollmentModel.updateEnrollmentProgress(enrollment.id, rate.percentage);
        }

        // Check if certificate issued
        const userCerts = CertificateModel.getUserCertificates(user.email);
        const courseCert = userCerts.find((c) => c.courseId === courseId);
        setCertificate(courseCert);

        // If 100% complete and no certificate, issue one
        // BUT only if there are actual assignments (not auto-100% from no assignments)
        if (rate.percentage === 100 && !courseCert && rate.total > 0) {
            issueCertificate();
        }
    };

    const issueCertificate = async () => {
        try {
            const course = mockCourses.find(
                (c) => c.id === courseId
            );

            if (!course) {
                console.error('Course not found for ID:', courseId);
                Alert.alert('Error', 'Course information not found');
                return;
            }

            const newCertificate = CertificateModel.issueCertificateToUser(user, course);
            setCertificate(newCertificate);

            Alert.alert(
                '🎉 Congratulations!',
                'You have completed all assignments! Your certificate has been issued.',
                [{ text: 'View Certificate', onPress: () => onViewCertificate?.(newCertificate) }]
            );
        } catch (error) {
            console.error('Error issuing certificate:', error);
            Alert.alert('Error', 'Failed to issue certificate: ' + error.message);
        }
    };

    const getSubmissionForAssignment = (assignmentId) => {
        return submissions.find((s) => s.assignmentId === assignmentId);
    };

    const renderAssignment = ({ item }) => {
        const submission = getSubmissionForAssignment(item.id);
        const isCompleted = !!submission;

        return (
            <TouchableOpacity
                style={styles.assignmentCard}
                onPress={() => onTakeAssignment(item.id)}
            >
                <View style={styles.assignmentHeader}>
                    <View style={styles.assignmentIcon}>
                        <Ionicons
                            name={isCompleted ? 'checkmark-circle' : 'document-text'}
                            size={32}
                            color={isCompleted ? '#10B981' : '#4F46E5'}
                        />
                    </View>
                    <View style={styles.assignmentInfo}>
                        <Text style={styles.assignmentTitle}>{item.title}</Text>
                        <Text style={styles.assignmentDesc} numberOfLines={2}>
                            {item.description}
                        </Text>
                    </View>
                </View>

                <View style={styles.assignmentFooter}>
                    <View style={styles.metaRow}>
                        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.metaText}>Due: {item.dueDate}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Ionicons name="trophy-outline" size={16} color="#6B7280" />
                        <Text style={styles.metaText}>{item.totalPoints} points</Text>
                    </View>

                    {isCompleted ? (
                        <View style={styles.statusBadge}>
                            <Ionicons name="checkmark" size={16} color="#FFF" />
                            <Text style={styles.statusText}>
                                {submission.percentage}% ({submission.score}/{submission.totalPoints})
                            </Text>
                        </View>
                    ) : (
                        <View style={[styles.statusBadge, styles.pendingBadge]}>
                            <Ionicons name="time-outline" size={16} color="#FFF" />
                            <Text style={styles.statusText}>Pending</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Assignments</Text>
                    <Text style={styles.headerSubtitle}>{courseName}</Text>
                </View>
            </View>

            {completionRate && (
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Course Progress</Text>
                        <Text style={styles.progressPercentage}>{completionRate.percentage}%</Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                        <View
                            style={[
                                styles.progressBar,
                                { width: `${completionRate.percentage}%` },
                            ]}
                        />
                    </View>

                    <Text style={styles.progressText}>
                        {completionRate.completed} of {completionRate.total} assignments completed
                    </Text>

                    {certificate && (
                        <TouchableOpacity
                            style={styles.certificateButton}
                            onPress={() => onViewCertificate?.(certificate)}
                        >
                            <Ionicons name="ribbon" size={20} color="#FFF" />
                            <Text style={styles.certificateButtonText}>View Certificate</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {assignments.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
                    <Text style={styles.emptyText}>No assignments available yet</Text>
                    <Text style={styles.emptySubtext}>
                        Your instructor hasn't published any assignments for this course
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={assignments}
                    renderItem={renderAssignment}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    },
    backButton: {
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    progressCard: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    progressPercentage: {
        fontSize: 24,
        fontWeight: '800',
        color: '#4F46E5',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4F46E5',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    certificateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    certificateButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    listContent: {
        padding: 16,
    },
    assignmentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    assignmentHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    assignmentIcon: {
        marginRight: 12,
    },
    assignmentInfo: {
        flex: 1,
    },
    assignmentTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    assignmentDesc: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    assignmentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    pendingBadge: {
        backgroundColor: '#F59E0B',
    },
    statusText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default CourseAssignmentsView;
