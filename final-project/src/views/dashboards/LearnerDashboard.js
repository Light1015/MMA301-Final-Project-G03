import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import web SCSS only on web builds
if (Platform.OS === 'web') {
  try {
    require('../../../styles/dashboards/learner-dashboard.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function LearnerDashboard() {
  return (
    <View style={styles.dashboard}>
      <Text style={styles.sectionTitle}>My Learning Dashboard</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="school" size={30} color="#4F46E5" />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Enrolled</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={30} color="#10B981" />
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={30} color="#F59E0B" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Ionicons name="school" size={40} color="#4F46E5" />
          <Text style={styles.cardTitle}>My Courses</Text>
          <Text style={styles.cardText}>Continue learning.</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="bar-chart" size={40} color="#10B981" />
          <Text style={styles.cardTitle}>Progress</Text>
          <Text style={styles.cardText}>Track achievements.</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Ionicons name="clipboard" size={40} color="#F59E0B" />
          <Text style={styles.cardTitle}>Assignments</Text>
          <Text style={styles.cardText}>Submit work.</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="chatbubbles" size={40} color="#EF4444" />
          <Text style={styles.cardTitle}>Discussions</Text>
          <Text style={styles.cardText}>Engage with peers.</Text>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4F46E5',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
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

