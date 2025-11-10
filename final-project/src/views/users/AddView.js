import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform, ScrollView } from 'react-native';
import { ROLES } from './constants';

if (Platform.OS === 'web') {
  try {
    require('../../../styles/users.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function AddView({ onCancel, onCreate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [enrolledCourses, setEnrolledCourses] = useState('0');
  const [completedCourses, setCompletedCourses] = useState('0');
  const [coursesTaught, setCoursesTaught] = useState('0');
  const [students, setStudents] = useState('0');

  const handleCreate = () => {
    if (!name || !email) {
      Alert.alert('Validation', 'Name and email are required');
      return;
    }
    
    const userData = {
      name,
      email,
      role,
      status: 'available',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    // Add role-specific fields
    if (role === 'Learner') {
      userData.enrolledCourses = parseInt(enrolledCourses) || 0;
      userData.completedCourses = parseInt(completedCourses) || 0;
    } else if (role === 'Teacher') {
      userData.coursesTaught = parseInt(coursesTaught) || 0;
      userData.students = parseInt(students) || 0;
    }

    onCreate(userData);
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}><Text style={styles.modalTitle}>Add User</Text></View>
      <ScrollView style={styles.modalBody}>
        <Text style={styles.modalLabel}>Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter full name" />
        
        <Text style={styles.modalLabel}>Email *</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="email@example.com" keyboardType="email-address" />
        
        <Text style={styles.modalLabel}>Role *</Text>
        <View style={styles.rolePicker}>
          {ROLES.map((r) => (
            <TouchableOpacity key={r} onPress={() => setRole(r)} style={[styles.roleOption, role===r && styles.roleOptionActive]}>
              <Text style={[styles.roleOptionText, role===r && styles.roleOptionTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {role === 'Learner' && (
          <>
            <Text style={styles.modalLabel}>Enrolled Courses</Text>
            <TextInput style={styles.input} value={enrolledCourses} onChangeText={setEnrolledCourses} keyboardType="numeric" placeholder="0" />
            
            <Text style={styles.modalLabel}>Completed Courses</Text>
            <TextInput style={styles.input} value={completedCourses} onChangeText={setCompletedCourses} keyboardType="numeric" placeholder="0" />
          </>
        )}

        {role === 'Teacher' && (
          <>
            <Text style={styles.modalLabel}>Courses Taught</Text>
            <TextInput style={styles.input} value={coursesTaught} onChangeText={setCoursesTaught} keyboardType="numeric" placeholder="0" />
            
            <Text style={styles.modalLabel}>Total Students</Text>
            <TextInput style={styles.input} value={students} onChangeText={setStudents} keyboardType="numeric" placeholder="0" />
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleCreate}><Text style={styles.submitButtonText}>Create User</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onCancel}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, width: '100%', maxWidth: 500 },
  modalHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  modalBody: { padding: 20 },
  modalLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  rolePicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: 'transparent' },
  roleOptionActive: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
  roleOptionText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  roleOptionTextActive: { color: '#4F46E5' },
  submitButton: { padding: 12, backgroundColor: '#4F46E5', borderRadius: 8, alignItems: 'center', marginTop: 12 },
  submitButtonText: { color: '#FFF', fontWeight: '600' },
  modalButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 8 },
  cancelButton: { backgroundColor: '#F3F4F6', alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
});
