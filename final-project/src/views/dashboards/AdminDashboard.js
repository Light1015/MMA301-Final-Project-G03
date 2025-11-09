import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import web SCSS only on web builds
if (Platform.OS === 'web') {
  try {
    require('../../../styles/dashboards/admin-dashboard.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function AdminDashboard({ onNavigateToUserManagement }) {
  return (
    <View style={styles.dashboard}>
      <Text style={styles.sectionTitle}>Admin Dashboard</Text>
      <View style={styles.cardRow}>
        {onNavigateToUserManagement ? (
          <TouchableOpacity style={styles.card} onPress={onNavigateToUserManagement}>
            <Ionicons name="people" size={40} color="#4F46E5" />
            <Text style={styles.cardTitle}>User Management</Text>
            <Text style={styles.cardText}>Manage users and roles.</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.card}>
            <Ionicons name="people" size={40} color="#4F46E5" />
            <Text style={styles.cardTitle}>User Management</Text>
            <Text style={styles.cardText}>Manage users and roles.</Text>
          </View>
        )}
        <View style={styles.card}>
          <Ionicons name="stats-chart" size={40} color="#10B981" />
          <Text style={styles.cardTitle}>Reports</Text>
          <Text style={styles.cardText}>View analytics.</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Ionicons name="settings" size={40} color="#F59E0B" />
          <Text style={styles.cardTitle}>System Settings</Text>
          <Text style={styles.cardText}>Configure platform.</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="shield-checkmark" size={40} color="#EF4444" />
          <Text style={styles.cardTitle}>Security</Text>
          <Text style={styles.cardText}>Monitor security.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4F46E5',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginHorizontal: 8,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'center',
    color: '#1F2937',
  },
  cardText: {
    color: '#6B7280',
    textAlign: 'center',
  },
});

