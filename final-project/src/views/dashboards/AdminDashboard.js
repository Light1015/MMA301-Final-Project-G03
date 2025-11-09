import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CertificateListView from '../certificates/CertificateListView';
import CertificateFormView from '../certificates/CertificateFormView';
import CertificateDetailView from '../certificates/CertificateDetailView';

// Import web SCSS only on web builds
if (Platform.OS === 'web') {
  try {
    require('../../../styles/dashboards/admin-dashboard.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function AdminDashboard({ onNavigateToUserManagement }) {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, list, form, detail
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  // Handle navigation to Certificate List
  const handleNavigateToCertificates = () => {
    setSelectedCertificateId(null);
    setCurrentView('list');
  };

  // Handle navigation to Certificate Form (Create/Edit)
  const handleNavigateToForm = (certificateId = null) => {
    setSelectedCertificateId(certificateId);
    setCurrentView('form');
  };

  // Handle navigation to Certificate Detail
  const handleNavigateToDetail = (certificateId) => {
    setSelectedCertificateId(certificateId);
    setCurrentView('detail');
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCertificateId(null);
  };

  // Handle back to list from form/detail
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCertificateId(null);
  };

  // Called when a certificate is created/updated/deleted to refresh list
  const handleSaved = () => {
    setRefreshToken((t) => t + 1);
    setCurrentView('list');
    setSelectedCertificateId(null);
  };

  // Render Certificate List View
  if (currentView === 'list') {
    return (
      <View style={{ flex: 1 }}>
        <CertificateListView
          onNavigateToForm={handleNavigateToForm}
          onNavigateToDetail={handleNavigateToDetail}
          refreshToken={refreshToken}
        />
      </View>
    );
  }

  // Render Certificate Form View (Create/Edit)
  if (currentView === 'form') {
    return (
      <View style={{ flex: 1 }}>
        <CertificateFormView
          certificateId={selectedCertificateId}
          onBack={handleBackToList}
          onSaved={handleSaved}
        />
      </View>
    );
  }

  // Render Certificate Detail View
  if (currentView === 'detail') {
    return (
      <View style={{ flex: 1 }}>
        <CertificateDetailView
          certificateId={selectedCertificateId}
          onBack={handleBackToList}
          onEdit={handleNavigateToForm}
          onSaved={handleSaved}
        />
      </View>
    );
  }

  // Render Dashboard (Default View)
  return (
    <View style={styles.dashboard}>
      <Text style={styles.sectionTitle}>Admin Dashboard</Text>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={onNavigateToUserManagement}>
          <Ionicons name="people" size={40} color="#4F46E5" />
          <Text style={styles.cardTitle}>User Management</Text>
          <Text style={styles.cardText}>Manage users and roles.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleNavigateToCertificates}>
          <Ionicons name="ribbon" size={40} color="#FFD700" />
          <Text style={styles.cardTitle}>Certificate Management</Text>
          <Text style={styles.cardText}>Create and manage certificates.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card}>
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
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="settings" size={40} color="#F59E0B" />
          <Text style={styles.cardTitle}>System Settings</Text>
          <Text style={styles.cardText}>Configure platform.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="shield-checkmark" size={40} color="#EF4444" />
          <Text style={styles.cardTitle}>Security</Text>
          <Text style={styles.cardText}>Monitor security.</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Ionicons name="megaphone" size={40} color="#8B5CF6" />
          <Text style={styles.cardTitle}>Announcements</Text>
          <Text style={styles.cardText}>Manage announcements.</Text>
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
    fontSize: 16,
  },
  cardText: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 14,
  },
});