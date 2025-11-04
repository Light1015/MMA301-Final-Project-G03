import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

const Navbar = ({ onLogout, role }) => {
  const menuItems = {
    Guest: [
      { name: 'Home', icon: 'home' },
      { name: 'Courses', icon: 'book' },
      { name: 'About', icon: 'information-circle' },
    ],
    Interviewer: [
      { name: 'Home', icon: 'home' },
      { name: 'Interviews', icon: 'people' },
      { name: 'Candidates', icon: 'person-add' },
    ],
    'Homepage Learner': [
      { name: 'Home', icon: 'home' },
      { name: 'My Courses', icon: 'school' },
      { name: 'Progress', icon: 'bar-chart' },
      { name: 'Assignments', icon: 'clipboard' },
    ],
    Teacher: [
      { name: 'Home', icon: 'home' },
      { name: 'Classes', icon: 'people' },
      { name: 'Assignments', icon: 'document' },
      { name: 'Students', icon: 'person' },
    ],
    Admin: [
      { name: 'Home', icon: 'home' },
      { name: 'Users', icon: 'people' },
      { name: 'Reports', icon: 'stats-chart' },
      { name: 'Settings', icon: 'settings' },
    ],
  };

  return (
    <View style={styles.navbar}>
      {menuItems[role].map((item) => (
        <TouchableOpacity key={item.name} style={styles.navItem}>
          <Ionicons name={item.icon} size={20} color="#4F46E5" />
          <Text style={styles.navText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.navItem} onPress={onLogout}>
        <Ionicons name="log-out" size={20} color="#EF4444" />
        <Text style={styles.navText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const DashboardContent = ({ role }) => {
  const contents = {
    Guest: (
      <View style={styles.dashboard}>
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
      </View>
    ),
    Interviewer: (
      <View style={styles.dashboard}>
        <Text style={styles.sectionTitle}>Interviewer Dashboard</Text>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Ionicons name="calendar" size={50} color="#4F46E5" />
            <Text style={styles.cardTitle}>Scheduled Interviews</Text>
            <Text style={styles.cardText}>Manage upcoming interviews.</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="people" size={50} color="#10B981" />
            <Text style={styles.cardTitle}>Candidates</Text>
            <Text style={styles.cardText}>Review candidate profiles.</Text>
          </View>
        </View>
      </View>
    ),
    'Homepage Learner': (
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
    ),
    Teacher: (
      <View style={styles.dashboard}>
        <Text style={styles.sectionTitle}>Teacher Dashboard</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="book" size={30} color="#4F46E5" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={30} color="#10B981" />
            <Text style={styles.statNumber}>150</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="document" size={30} color="#F59E0B" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Assignments</Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Ionicons name="people" size={40} color="#4F46E5" />
            <Text style={styles.cardTitle}>My Classes</Text>
            <Text style={styles.cardText}>Manage courses.</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="document" size={40} color="#10B981" />
            <Text style={styles.cardTitle}>Assignments</Text>
            <Text style={styles.cardText}>Create and grade.</Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Ionicons name="analytics" size={40} color="#F59E0B" />
            <Text style={styles.cardTitle}>Student Progress</Text>
            <Text style={styles.cardText}>Monitor performance.</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="megaphone" size={40} color="#EF4444" />
            <Text style={styles.cardTitle}>Announcements</Text>
            <Text style={styles.cardText}>Post updates.</Text>
          </View>
        </View>
      </View>
    ),
    Admin: (
      <View style={styles.dashboard}>
        <Text style={styles.sectionTitle}>Admin Dashboard</Text>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Ionicons name="people" size={40} color="#4F46E5" />
            <Text style={styles.cardTitle}>User Management</Text>
            <Text style={styles.cardText}>Manage users and roles.</Text>
          </View>
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
    ),
  };

  return contents[role] || contents.Guest;
};

const Footer = () => (
  <View style={styles.footer}>
    <Ionicons name="heart" size={20} color="#EF4444" />
    <Text style={styles.footerText}>© 2025 Eduling Go. All rights reserved.</Text>
    <Ionicons name="logo-react" size={20} color="#61DAFB" />
  </View>
);

export default function HomeView({ user, onLogout }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header user={user} />
      <Navbar onLogout={onLogout} role={user.role} />
      <DashboardContent role={user.role} />
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  navItem: {
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
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
  logoIcon: {
    marginBottom: 8,
  },
  avatarIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  navItem: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 4,
  },
  dashboard: {
    paddingHorizontal: 10,
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
});
