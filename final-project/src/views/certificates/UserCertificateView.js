// User Certificate View - Display and download certificate
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Share,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const UserCertificateView = ({ certificate, onBack }) => {
    const handleDownload = () => {
        // In a real app, this would generate a PDF
        Alert.alert(
            'Download Certificate',
            'Certificate download feature will be implemented with PDF generation library.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Simulate download
                        Alert.alert('Success', 'Certificate saved to your device!');
                    },
                },
            ]
        );
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `I've completed ${certificate.courseName} and earned my certificate! 🎓`,
                title: 'Share Certificate',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to share certificate');
        }
    };

    if (!certificate) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Certificate</Text>
                </View>
                <View style={styles.centerContainer}>
                    <Text>Certificate not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Certificate</Text>
                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                    <Ionicons name="share-social" size={24} color="#4F46E5" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Certificate Preview */}
                <View style={styles.certificateCard}>
                    <View style={styles.certificateBorder}>
                        <View style={styles.certificateInner}>
                            {/* Decorative corners */}
                            <View style={[styles.corner, styles.cornerTopLeft]} />
                            <View style={[styles.corner, styles.cornerTopRight]} />
                            <View style={[styles.corner, styles.cornerBottomLeft]} />
                            <View style={[styles.corner, styles.cornerBottomRight]} />

                            {/* Certificate content */}
                            <View style={styles.certificateContent}>
                                <Ionicons name="ribbon" size={48} color="#F59E0B" />

                                <Text style={styles.certificateOfTitle}>CERTIFICATE</Text>
                                <Text style={styles.certificateOfSubtitle}>of Achievement</Text>

                                <View style={styles.divider} />

                                <Text style={styles.presentedTo}>This is presented to</Text>
                                <Text style={styles.userName}>{certificate.userName}</Text>

                                <Text style={styles.completionText}>
                                    for successfully completing
                                </Text>
                                <Text style={styles.courseName}>{certificate.courseName}</Text>

                                <View style={styles.detailsRow}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Issue Date</Text>
                                        <Text style={styles.detailValue}>{certificate.issueDate}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Validity</Text>
                                        <Text style={styles.detailValue}>
                                            {certificate.validityPeriod}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.signatureRow}>
                                    <View style={styles.signature}>
                                        <View style={styles.signatureLine} />
                                        <Text style={styles.signatureLabel}>Instructor</Text>
                                    </View>
                                    <View style={styles.signature}>
                                        <View style={styles.signatureLine} />
                                        <Text style={styles.signatureLabel}>Director</Text>
                                    </View>
                                </View>

                                <Text style={styles.certificateId}>
                                    Certificate ID: CERT-{certificate.id}-{new Date(certificate.issueDate).getFullYear()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Certificate Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Certificate Information</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={20} color="#6B7280" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Recipient</Text>
                            <Text style={styles.infoValue}>{certificate.userName}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="school-outline" size={20} color="#6B7280" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Course</Text>
                            <Text style={styles.infoValue}>{certificate.courseName}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Issued On</Text>
                            <Text style={styles.infoValue}>{certificate.issueDate}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color="#6B7280" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Valid Until</Text>
                            <Text style={styles.infoValue}>
                                {certificate.validityPeriod === 'Lifetime'
                                    ? 'No Expiration'
                                    : certificate.validityPeriod}
                            </Text>
                        </View>
                    </View>

                    {certificate.description && (
                        <View style={styles.infoRow}>
                            <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Description</Text>
                                <Text style={styles.infoValue}>{certificate.description}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                    <Ionicons name="download" size={24} color="#FFF" />
                    <Text style={styles.downloadButtonText}>Download Certificate</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shareButtonLarge} onPress={handleShare}>
                    <Ionicons name="share-social" size={24} color="#4F46E5" />
                    <Text style={styles.shareButtonText}>Share Achievement</Text>
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
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    shareButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        flex: 1,
        textAlign: 'center',
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
    certificateCard: {
        marginBottom: 16,
    },
    certificateBorder: {
        padding: 8,
        backgroundColor: '#F59E0B',
        borderRadius: 16,
    },
    certificateInner: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: '#F59E0B',
        borderWidth: 2,
    },
    cornerTopLeft: {
        top: 12,
        left: 12,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    cornerTopRight: {
        top: 12,
        right: 12,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    cornerBottomLeft: {
        bottom: 12,
        left: 12,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    cornerBottomRight: {
        bottom: 12,
        right: 12,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    certificateContent: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    certificateOfTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
        marginTop: 16,
        letterSpacing: 2,
    },
    certificateOfSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
        fontStyle: 'italic',
    },
    divider: {
        width: 120,
        height: 2,
        backgroundColor: '#F59E0B',
        marginVertical: 16,
    },
    presentedTo: {
        fontSize: 14,
        color: '#6B7280',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4F46E5',
        marginTop: 8,
        marginBottom: 16,
    },
    completionText: {
        fontSize: 14,
        color: '#6B7280',
    },
    courseName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 8,
        marginBottom: 16,
        textAlign: 'center',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 16,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    signatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 24,
        marginBottom: 16,
    },
    signature: {
        alignItems: 'center',
        width: 100,
    },
    signatureLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#D1D5DB',
        marginBottom: 4,
    },
    signatureLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    certificateId: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 12,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    infoContent: {
        flex: 1,
        marginLeft: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
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
    downloadButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    shareButtonLarge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#4F46E5',
    },
    shareButtonText: {
        color: '#4F46E5',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
});

export default UserCertificateView;
