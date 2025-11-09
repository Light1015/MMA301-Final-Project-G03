import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import web SCSS only on web builds
if (Platform.OS === 'web') {
  try {
    require('../../styles/home.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function PublicHomeView({ onNavigateToLogin }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="school" size={60} color="#4F46E5" style={styles.logoIcon} />
        <Text style={styles.title}>Eduling Go</Text>
        <Text style={styles.subtitle}>Welcome to Eduling Go</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Explore Eduling Go</Text>
        <Text style={styles.sectionText}>Discover courses and start your learning journey.</Text>
        
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Ionicons name="book" size={50} color="#4F46E5" />
            <Text style={styles.cardTitle}>Browse Courses</Text>
            <Text style={styles.cardText}>Find the perfect course for you.</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="person-add" size={50} color="#10B981" />
            <Text style={styles.cardTitle}>Sign Up</Text>
            <Text style={styles.cardText}>Join our community today.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={onNavigateToLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Ionicons name="heart" size={20} color="#EF4444" />
        <Text style={styles.footerText}>© 2025 Eduling Go. All rights reserved.</Text>
        <Ionicons name="logo-react" size={20} color="#61DAFB" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  logoIcon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#4F46E5',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 18,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4F46E5',
  },
  sectionText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
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
  loginButton: {
    width: '100%',
    maxWidth: 400,
    padding: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
    marginHorizontal: 8,
  },
});

