import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

if (Platform.OS === 'web') {
  try {
    require('../../../styles/users.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function DeleteView({ user, onCancel, onConfirm }) {
  const isActive = user?.status === 'available';
  const actionText = isActive ? 'Disable' : 'Restore';
  const actionColor = isActive ? '#EF4444' : '#10B981';
  
  return (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{actionText} User</Text>
      </View>
      <View style={styles.modalBody}>
        <Text style={styles.modalLabel}>
          Are you sure you want to {actionText.toLowerCase()} {user.email}?
        </Text>
        {isActive ? (
          <Text style={styles.warningText}>
            This user will be unable to access the system.
          </Text>
        ) : (
          <Text style={styles.successText}>
            This user will be able to access the system again.
          </Text>
        )}
        <View style={{height:12}} />
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: actionColor }]} 
          onPress={() => onConfirm(user)}
        >
          <Text style={styles.submitButtonText}>{actionText}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modalButton, styles.cancelButton]} 
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, width: '100%', maxWidth: 500 },
  modalHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  modalBody: { padding: 20 },
  modalLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  warningText: { fontSize: 13, color: '#EF4444', marginTop: 4, fontStyle: 'italic' },
  successText: { fontSize: 13, color: '#10B981', marginTop: 4, fontStyle: 'italic' },
  submitButton: { padding: 12, backgroundColor: '#4F46E5', borderRadius: 8, alignItems: 'center', marginTop: 12 },
  submitButtonText: { color: '#FFF', fontWeight: '600' },
  modalButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 8 },
  cancelButton: { backgroundColor: '#F3F4F6', alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
});

