import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { ROLES } from './constants';

if (Platform.OS === 'web') {
  try {
    require('../../../styles/users.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function UpdateView({ user, onCancel, onSave }) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [enrolledCourses, setEnrolledCourses] = useState(String(user.enrolledCourses || 0));
  const [completedCourses, setCompletedCourses] = useState(String(user.completedCourses || 0));
  const [coursesTaught, setCoursesTaught] = useState(String(user.coursesTaught || 0));
  const [students, setStudents] = useState(String(user.students || 0));

  const handleSave = () => {
    const updatedData = {
      ...user,
      name,
      role,
    };

    // Add role-specific fields
    if (role === 'Learner') {
      updatedData.enrolledCourses = parseInt(enrolledCourses) || 0;
      updatedData.completedCourses = parseInt(completedCourses) || 0;
      // Remove teacher fields if switching from teacher to learner
      delete updatedData.coursesTaught;
      delete updatedData.students;
    } else if (role === 'Teacher') {
      updatedData.coursesTaught = parseInt(coursesTaught) || 0;
      updatedData.students = parseInt(students) || 0;
      // Remove learner fields if switching from learner to teacher
      delete updatedData.enrolledCourses;
      delete updatedData.completedCourses;
    }

    onSave(updatedData);
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}><Text style={styles.modalTitle}>Update User</Text></View>
      <ScrollView style={styles.modalBody}>
        <Text style={styles.modalLabel}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.modalLabel}>Email (Read-only)</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={user.email} editable={false} />

        <Text style={styles.modalLabel}>Role</Text>
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
            <TextInput style={styles.input} value={enrolledCourses} onChangeText={setEnrolledCourses} keyboardType="numeric" />
            
            <Text style={styles.modalLabel}>Completed Courses</Text>
            <TextInput style={styles.input} value={completedCourses} onChangeText={setCompletedCourses} keyboardType="numeric" />
          </>
        )}

        {role === 'Teacher' && (
          <>
            <Text style={styles.modalLabel}>Courses Taught</Text>
            <TextInput style={styles.input} value={coursesTaught} onChangeText={setCoursesTaught} keyboardType="numeric" />
            
            <Text style={styles.modalLabel}>Total Students</Text>
            <TextInput style={styles.input} value={students} onChangeText={setStudents} keyboardType="numeric" />
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSave}><Text style={styles.submitButtonText}>Save Changes</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onCancel}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '85%' },
  modalHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  modalBody: { padding: 20 },
  modalLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 16 },
  inputDisabled: { backgroundColor: '#F3F4F6', color: '#9CA3AF' },
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
