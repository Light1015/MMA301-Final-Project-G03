import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROLES } from './constants';

if (Platform.OS === 'web') {
  try {
    require('../../../styles/users.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function ListView({ users, onEdit, onDelete, onAdd, onView, onBack, currentUser }) {
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = !searchText || 
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRole = filterRole === 'All' || u.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Role Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, filterRole === 'All' && styles.filterChipActive]}
            onPress={() => setFilterRole('All')}
          >
            <Ionicons name="people" size={16} color={filterRole === 'All' ? '#FFF' : '#6B7280'} />
            <Text style={[styles.filterChipText, filterRole === 'All' && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {ROLES.map((role) => {
            const icons = {
              'Learner': 'school',
              'Teacher': 'person',
              'Admin': 'shield-checkmark'
            };
            return (
              <TouchableOpacity
                key={role}
                style={[styles.filterChip, filterRole === role && styles.filterChipActive]}
                onPress={() => setFilterRole(role)}
              >
                <Ionicons name={icons[role]} size={16} color={filterRole === role ? '#FFF' : '#6B7280'} />
                <Text style={[styles.filterChipText, filterRole === role && styles.filterChipTextActive]}>
                  {role}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.usersContainer}>
          <TouchableOpacity onPress={onAdd} style={styles.addButton}>
            <Ionicons name="add-circle" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add User</Text>
          </TouchableOpacity>
          <Text style={styles.usersCount}>{filteredUsers.length} user{filteredUsers.length!==1?'s':''} found</Text>
          {filteredUsers.map((u) => (
            <View key={u.email} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{u.name.charAt(0)}</Text>
                  {/* Status Indicator */}
                  <View style={[
                    styles.statusIndicator, 
                    u.status === 'available' ? styles.statusAvailable : styles.statusUnavailable
                  ]} />
                </View>
                <View style={styles.userDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{u.name}</Text>
                    {/* Status Badge */}
                    <View style={[
                      styles.statusBadge,
                      u.status === 'available' ? styles.statusBadgeAvailable : styles.statusBadgeUnavailable
                    ]}>
                      <Ionicons 
                        name={u.status === 'available' ? 'checkmark-circle' : 'close-circle'} 
                        size={14} 
                        color={u.status === 'available' ? '#10B981' : '#EF4444'} 
                      />
                      <Text style={[
                        styles.statusText,
                        u.status === 'available' ? styles.statusTextAvailable : styles.statusTextUnavailable
                      ]}>
                        {u.status === 'available' ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.userEmail}>{u.email}</Text>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{u.role}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity onPress={() => onView(u)} style={[styles.actionButton, styles.viewButton]}>
                  <Ionicons name="eye-outline" size={20} color="#10B981" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onEdit(u)} style={[styles.actionButton, styles.editButton]}>
                  <Ionicons name="create-outline" size={20} color="#4F46E5" />
                </TouchableOpacity>
                {u.email !== currentUser.email && (
                  <TouchableOpacity 
                    onPress={() => onDelete(u)} 
                    style={[
                      styles.actionButton, 
                      u.status === 'available' ? styles.disableButton : styles.restoreButton
                    ]}
                  >
                    <Ionicons 
                      name={u.status === 'available' ? 'ban-outline' : 'refresh-outline'} 
                      size={20} 
                      color={u.status === 'available' ? '#EF4444' : '#10B981'} 
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          
          {filteredUsers.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color="#9CA3AF" />
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', marginTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1F2937', textAlign: 'center', flex: 1 },
  placeholder: { width: 40 },
  searchContainer: { padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12, height: 48 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1F2937' },
  filterContainer: { marginTop: 8 },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', marginRight: 8, gap: 6 },
  filterChipActive: { backgroundColor: '#4F46E5' },
  filterChipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  filterChipTextActive: { color: '#FFF' },
  content: { flex: 1 },
  usersContainer: { padding: 16 },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginBottom: 16, alignSelf: 'flex-start', gap: 8 },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  usersCount: { fontSize: 14, color: '#6B7280', marginBottom: 12, fontWeight: '600' },
  userCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#E5E7EB' },
  userInfo: { flexDirection: 'row', flex: 1 },
  userAvatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#4F46E5', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12,
    position: 'relative',
  },
  userAvatarText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statusAvailable: {
    backgroundColor: '#10B981',
  },
  statusUnavailable: {
    backgroundColor: '#EF4444',
  },
  userDetails: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  userName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  statusBadgeAvailable: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeUnavailable: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#059669',
  },
  statusTextUnavailable: {
    color: '#DC2626',
  },
  userEmail: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  roleBadge: { backgroundColor: '#E5E7EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  roleText: { fontSize: 12, fontWeight: '600', color: '#4F46E5' },
  userActions: { flexDirection: 'row', gap: 8 },
  actionButton: { padding: 8, borderRadius: 8, backgroundColor: '#F3F4F6' },
  viewButton: { backgroundColor: '#D1FAE5' },
  editButton: { backgroundColor: '#EEF2FF' },
  disableButton: { backgroundColor: '#FEE2E2' },
  restoreButton: { backgroundColor: '#D1FAE5' },
  deleteButton: { backgroundColor: '#FEE2E2' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#9CA3AF', marginTop: 12 },
});
