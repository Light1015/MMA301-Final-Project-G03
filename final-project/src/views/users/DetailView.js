import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'web') {
  try {
    require('../../../styles/users.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function DetailView({ user, onClose, onEdit }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    return status === 'available' ? '#10B981' : '#EF4444';
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>User Details</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) + '20' }]}>
            <Ionicons name={user.status === 'available' ? 'checkmark-circle' : 'close-circle'} size={16} color={getStatusColor(user.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>User ID</Text>
            <Text style={styles.fieldValue}>#{user.id}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{user.email}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Role</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Joined Date</Text>
            <Text style={styles.fieldValue}>{formatDate(user.joinedDate)}</Text>
          </View>
        </View>

        {/* Role-specific Info */}
        {user.role === 'Learner' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Progress</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Enrolled Courses</Text>
              <Text style={styles.fieldValue}>{user.enrolledCourses || 0}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Completed Courses</Text>
              <Text style={styles.fieldValue}>{user.completedCourses || 0}</Text>
            </View>
          </View>
        )}

        {user.role === 'Teacher' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Teaching Statistics</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Courses Taught</Text>
              <Text style={styles.fieldValue}>{user.coursesTaught || 0}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Total Students</Text>
              <Text style={styles.fieldValue}>{user.students || 0}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.modalFooter}>
        <TouchableOpacity style={[styles.modalButton, styles.editButton]} onPress={() => onEdit(user)}>
          <Ionicons name="create-outline" size={20} color="#FFF" />
          <Text style={styles.editButtonText}>Edit User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, width: '100%', maxWidth: 600, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  modalBody: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarLargeText: { color: '#FFF', fontSize: 40, fontWeight: '700' },
  userName: { fontSize: 24, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 6 },
  statusText: { fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { fontSize: 16, color: '#1F2937' },
  roleBadge: { backgroundColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  roleText: { fontSize: 14, fontWeight: '600', color: '#4F46E5' },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  modalButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, gap: 8 },
  editButton: { backgroundColor: '#4F46E5' },
  editButtonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
