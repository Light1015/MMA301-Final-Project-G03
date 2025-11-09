import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminDashboard from './dashboards/AdminDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import LearnerDashboard from './dashboards/LearnerDashboard';

// Import web SCSS only on web builds
if (Platform.OS === 'web') {
  try {
    require('../../styles/home.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

const Header = ({ user }) => (
  <View style={styles.header}>
    <Ionicons name="school" size={60} color="#4F46E5" style={styles.logoIcon} />
    <Text style={styles.title}>Eduling Go</Text>
    <Text style={styles.subtitle}>Welcome, {user.name} ({user.role})</Text>
    <Ionicons name="person-circle" size={30} color="#10B981" style={styles.avatarIcon} />
  </View>
);

const TopNavbar = ({ onLogout, role }) => {
  return (
    <View style={styles.topNavbar}>
      <View style={styles.topNavContent}>
        <Text style={styles.topNavTitle}>Eduling Go</Text>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BottomNavbar = ({ role, onNavigateToUserManagement, activeTab, setActiveTab }) => {
  const menuItems = {
    Learner: [
      { id: 'home', name: 'Home', icon: 'home-outline', iconActive: 'home' },
      { id: 'courses', name: 'Courses', icon: 'school-outline', iconActive: 'school' },
      { id: 'progress', name: 'Progress', icon: 'bar-chart-outline', iconActive: 'bar-chart' },
      { id: 'assignments', name: 'Assignments', icon: 'clipboard-outline', iconActive: 'clipboard' },
    ],
    Teacher: [
      { id: 'home', name: 'Home', icon: 'home-outline', iconActive: 'home' },
      { id: 'classes', name: 'Classes', icon: 'people-outline', iconActive: 'people' },
      { id: 'assignments', name: 'Assignments', icon: 'document-outline', iconActive: 'document' },
      { id: 'students', name: 'Students', icon: 'person-outline', iconActive: 'person' },
    ],
    Admin: [
      { id: 'home', name: 'Home', icon: 'home-outline', iconActive: 'home' },
      { id: 'users', name: 'Users', icon: 'people-outline', iconActive: 'people', action: onNavigateToUserManagement || undefined },
      { id: 'reports', name: 'Reports', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
      { id: 'settings', name: 'Settings', icon: 'settings-outline', iconActive: 'settings' },
    ],
  };

  const items = menuItems[role] || menuItems.Learner;

  return (
    <View style={styles.bottomNavbar}>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.bottomNavItem, isActive && styles.bottomNavItemActive]}
            onPress={() => {
              if (item.action) {
                item.action();
              } else {
                setActiveTab(item.id);
              }
            }}
          >
            <Ionicons
              name={isActive ? item.iconActive : item.icon}
              size={24}
              color={isActive ? '#4F46E5' : '#6B7280'}
            />
            <Text style={[styles.bottomNavText, isActive && styles.bottomNavTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const DashboardContent = ({ role, onNavigateToUserManagement }) => {
  switch (role) {
    case 'Admin':
      return <AdminDashboard onNavigateToUserManagement={onNavigateToUserManagement || undefined} />;
    case 'Teacher':
      return <TeacherDashboard />;
    case 'Learner':
      return <LearnerDashboard />;
    default:
      return <LearnerDashboard />;
  }
};

const Footer = () => (
  <View style={styles.footer}>
    <Ionicons name="heart" size={20} color="#EF4444" />
    <Text style={styles.footerText}>© 2025 Eduling Go. All rights reserved.</Text>
    <Ionicons name="logo-react" size={20} color="#61DAFB" />
  </View>
);

export default function HomeView({ user, onLogout, onNavigateToUserManagement }) {
  const [activeTab, setActiveTab] = useState('home');

  // Only Admin can access User Management
  const canAccessUserManagement = user.role === 'Admin';

  return (
    <View style={styles.wrapper}>
      <TopNavbar onLogout={onLogout} role={user.role} />
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Header user={user} />
        <DashboardContent
          role={user.role}
          onNavigateToUserManagement={canAccessUserManagement ? onNavigateToUserManagement : null}
        />
        <Footer />
      </ScrollView>
      <BottomNavbar
        role={user.role}
        onNavigateToUserManagement={canAccessUserManagement ? onNavigateToUserManagement : null}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 100, // Space for bottom navbar
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  topNavbar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 10,
      },
    }),
  },
  topNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topNavTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4F46E5',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  logoutText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    position: 'relative',
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
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  bottomNavItemActive: {
    // Active state styling
  },
  bottomNavText: {
    fontSize: 12,
    marginTop: 4,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomNavTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
    marginHorizontal: 8,
  },
  logoIcon: {
    marginBottom: 8,
  },
  avatarIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
