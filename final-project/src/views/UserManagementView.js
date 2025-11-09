import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserModel from '../models/UserModel';

const ROLES = ['Learner', 'Teacher', 'Admin'];
const STATUSES = ['available', 'unavailable'];

export default function UserManagementView({ user, onBack }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Learner');

  // Check if user is Admin - only Admin can access this view
  useEffect(() => {
    if (user.role !== 'Admin') {
      Alert.alert('Access Denied', 'Only Admin can access User Management', [
        {
          text: 'OK',
          onPress: () => {
            if (onBack) {
              onBack();
            }
          },
        },
      ]);
      return;
    }
    // Only load users if user is Admin
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role]);

  useEffect(() => {
    filterUsers();
  }, [users, searchText, filterRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await UserModel.getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search text (name, email)
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }

    // Filter by role
    if (filterRole !== 'All') {
      filtered = filtered.filter((u) => u.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (userToDelete) => {
    if (userToDelete.email === user.email) {
      Alert.alert('Error', 'You cannot disable your own account');
      return;
    }

    if (userToDelete.status === 'unavailable') {
      Alert.alert('Info', 'This user is already disabled');
      return;
    }

    Alert.alert(
      'Disable User',
      `Are you sure you want to disable ${userToDelete.email}? This will prevent them from logging in.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserModel.updateUserStatus(userToDelete.email, 'unavailable');
              Alert.alert('Success', 'User disabled successfully');
              loadUsers();
            } catch (error) {
              Alert.alert('Error', 'Failed to disable user');
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (userToToggle) => {
    if (userToToggle.email === user.email) {
      Alert.alert('Error', 'You cannot disable your own account');
      return;
    }

    const newStatus = userToToggle.status === 'available' ? 'unavailable' : 'available';
    const action = newStatus === 'unavailable' ? 'disable' : 'enable';

    Alert.alert(
      `${action === 'disable' ? 'Disable' : 'Enable'} User`,
      `Are you sure you want to ${action} ${userToToggle.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'disable' ? 'Disable' : 'Enable',
          style: action === 'disable' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await UserModel.updateUserStatus(userToToggle.email, newStatus);
              Alert.alert('Success', `User ${action}d successfully`);
              loadUsers();
            } catch (error) {
              Alert.alert('Error', `Failed to ${action} user`);
            }
          },
        },
      ]
    );
  };

  const handleRestore = async (userToRestore) => {
    Alert.alert(
      'Restore User',
      `Are you sure you want to restore ${userToRestore.email}? The user will be able to login again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'default',
          onPress: async () => {
            try {
              await UserModel.updateUserStatus(userToRestore.email, 'available');
              Alert.alert('Success', 'User restored successfully');
              loadUsers();
            } catch (error) {
              Alert.alert('Error', 'Failed to restore user');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditStatus(user.status);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    // Validate name
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      const updates = {};
      let hasChanges = false;

      // Update name if changed
      if (selectedUser.name !== editName.trim()) {
        updates.name = editName.trim();
        // Update avatar with new initial
        updates.avatar = `https://via.placeholder.com/100x100.png?text=${editName.trim().charAt(0).toUpperCase()}`;
        hasChanges = true;
      }

      // Update status if changed
      if (selectedUser.status !== editStatus) {
        // Don't allow disabling own account
        if (selectedUser.email === user.email && editStatus === 'unavailable') {
          Alert.alert('Error', 'You cannot disable your own account');
          return;
        }
        await UserModel.updateUserStatus(selectedUser.email, editStatus);
        hasChanges = true;
      }

      // Update name and avatar if changed
      if (updates.name) {
        await UserModel.updateUser(selectedUser.email, updates);
      }

      if (hasChanges) {
        Alert.alert('Success', 'User updated successfully');
        setEditModalVisible(false);
        setSelectedUser(null);
        setEditName('');
        loadUsers();
      } else {
        Alert.alert('Info', 'No changes to save');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update user');
    }
  };

  const handleAddUser = async () => {
    // Validate inputs
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(newUserEmail.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Validate password length
    if (newUserPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await UserModel.addUser({
        name: newUserName.trim(),
        email: newUserEmail.trim().toLowerCase(),
        role: newUserRole,
        password: newUserPassword,
      });
      Alert.alert('Success', 'User added successfully');
      setAddModalVisible(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('Learner');
      loadUsers();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add user');
    }
  };

  const getStatusColor = (status) => {
    return status === 'available' ? '#10B981' : '#EF4444';
  };

  const getStatusIcon = (status) => {
    return status === 'available' ? 'checkmark-circle' : 'close-circle';
  };

  // Only Admin can access this view
  if (user.role !== 'Admin') {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="lock-closed" size={60} color="#EF4444" />
        <Text style={styles.loadingText}>Access Denied</Text>
        <Text style={styles.loadingText}>Only Admin can access User Management</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Add User Button */}
        <View style={styles.addUserContainer}>
          <TouchableOpacity
            onPress={() => setAddModalVisible(true)}
            style={styles.addUserButton}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.addUserButtonText}>Add User</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
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
              <Text style={[styles.filterChipText, filterRole === 'All' && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role}
                style={[styles.filterChip, filterRole === role && styles.filterChipActive]}
                onPress={() => setFilterRole(role)}
              >
                <Text style={[styles.filterChipText, filterRole === role && styles.filterChipTextActive]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Users List */}
        <View style={styles.usersContainer}>
          <Text style={styles.usersCount}>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </Text>

          {filteredUsers.map((u) => (
            <View key={u.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{u.name.charAt(0)}</Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <Text style={styles.userEmail}>{u.email}</Text>
                  <View style={styles.userMeta}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(u.status) + '20' }]}>
                      <Ionicons
                        name={getStatusIcon(u.status)}
                        size={14}
                        color={getStatusColor(u.status)}
                      />
                      <Text style={[styles.statusText, { color: getStatusColor(u.status) }]}>
                        {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleText}>{u.role}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(u)}
                >
                  <Ionicons name="create-outline" size={20} color="#4F46E5" />
                </TouchableOpacity>
                {u.email !== user.email && u.status === 'available' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(u)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
                {u.email !== user.email && u.status === 'unavailable' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.restoreButton]}
                    onPress={() => handleRestore(u)}
                  >
                    <Ionicons name="refresh-outline" size={20} color="#10B981" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {filteredUsers.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#9CA3AF" />
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navbar */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={onBack}
        >
          <Ionicons name="home-outline" size={24} color="#6B7280" />
          <Text style={styles.bottomNavText}>Home</Text>
        </TouchableOpacity>
        <View style={[styles.bottomNavItem, styles.bottomNavItemActive]}>
          <Ionicons name="people" size={24} color="#4F46E5" />
          <Text style={[styles.bottomNavText, styles.bottomNavTextActive]}>Users</Text>
        </View>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {
            loadUsers();
          }}
        >
          <Ionicons name="refresh-outline" size={24} color="#6B7280" />
          <Text style={styles.bottomNavText}>Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
          <Text style={styles.bottomNavText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit User</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <>
                <View style={styles.modalBody}>
                  <Text style={styles.modalLabel}>Email:</Text>
                  <View style={styles.readOnlyField}>
                    <Text style={styles.readOnlyText}>{selectedUser.email}</Text>
                    <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                  </View>
                  <Text style={styles.modalHint}>Email cannot be changed</Text>

                  <Text style={styles.modalLabel}>Role:</Text>
                  <View style={styles.readOnlyField}>
                    <View style={[styles.roleBadge, styles.readOnlyBadge]}>
                      <Text style={styles.roleText}>{selectedUser.role}</Text>
                    </View>
                    <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                  </View>
                  <Text style={styles.modalHint}>Role cannot be changed</Text>

                  <Text style={styles.modalLabel}>Name:</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter user name"
                    value={editName}
                    onChangeText={setEditName}
                    autoCapitalize="words"
                  />

                  <Text style={styles.modalLabel}>Status:</Text>
                  <View style={styles.statusPicker}>
                    {STATUSES.map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[styles.statusOption, editStatus === status && styles.statusOptionActive]}
                        onPress={() => {
                          // Prevent disabling own account
                          if (selectedUser.email === user.email && status === 'unavailable') {
                            Alert.alert('Error', 'You cannot disable your own account');
                            return;
                          }
                          setEditStatus(status);
                        }}
                        disabled={selectedUser.email === user.email && status === 'unavailable'}
                      >
                        <Ionicons
                          name={getStatusIcon(status)}
                          size={20}
                          color={
                            selectedUser.email === user.email && status === 'unavailable'
                              ? '#9CA3AF'
                              : editStatus === status
                              ? getStatusColor(status)
                              : '#6B7280'
                          }
                        />
                        <Text
                          style={[
                            styles.statusOptionText,
                            editStatus === status && { color: getStatusColor(status) },
                            selectedUser.email === user.email && status === 'unavailable' && { color: '#9CA3AF' },
                          ]}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {selectedUser.email === user.email && (
                    <Text style={styles.modalHint}>You cannot disable your own account</Text>
                  )}
                  {selectedUser.status === 'unavailable' && (
                    <TouchableOpacity
                      style={styles.restoreButtonModal}
                      onPress={() => {
                        if (selectedUser.email === user.email) {
                          Alert.alert('Error', 'You cannot restore your own account');
                          return;
                        }
                        Alert.alert(
                          'Restore User',
                          `Are you sure you want to restore ${selectedUser.email}? The user will be able to login again.`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Restore',
                              style: 'default',
                              onPress: async () => {
                                try {
                                  await UserModel.updateUserStatus(selectedUser.email, 'available');
                                  Alert.alert('Success', 'User restored successfully', [
                                    {
                                      text: 'OK',
                                      onPress: () => {
                                        setEditModalVisible(false);
                                        setSelectedUser(null);
                                        setEditName('');
                                        loadUsers();
                                      },
                                    },
                                  ]);
                                } catch (error) {
                                  Alert.alert('Error', 'Failed to restore user');
                                }
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <Ionicons name="refresh" size={20} color="#10B981" />
                      <Text style={styles.restoreButtonText}>Restore User</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setEditModalVisible(false);
                      setSelectedUser(null);
                      setEditName('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleUpdate}
                  >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add User Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New User</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Name:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter user name"
                value={newUserName}
                onChangeText={setNewUserName}
              />

              <Text style={styles.modalLabel}>Email:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter email address"
                value={newUserEmail}
                onChangeText={setNewUserEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.modalLabel}>Password:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter password (min 6 characters)"
                value={newUserPassword}
                onChangeText={setNewUserPassword}
                secureTextEntry
              />

              <Text style={styles.modalLabel}>Role:</Text>
              <View style={styles.rolePicker}>
                {ROLES.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleOption, newUserRole === role && styles.roleOptionActive]}
                    onPress={() => setNewUserRole(role)}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        newUserRole === role && styles.roleOptionTextActive,
                      ]}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setAddModalVisible(false);
                  setNewUserName('');
                  setNewUserEmail('');
                  setNewUserPassword('');
                  setNewUserRole('Learner');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddUser}
              >
                <Text style={styles.saveButtonText}>Add User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // Space for bottom navbar
  },
  addUserContainer: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addUserButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  usersContainer: {
    padding: 16,
    paddingTop: 12,
  },
  usersCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roleBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  editButton: {
    backgroundColor: '#EEF2FF',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  enableButton: {
    backgroundColor: '#D1FAE5',
  },
  restoreButton: {
    backgroundColor: '#D1FAE5',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginTop: 16,
  },
  modalValue: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 4,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  readOnlyBadge: {
    backgroundColor: '#E5E7EB',
  },
  modalHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  rolePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  roleOptionTextActive: {
    color: '#4F46E5',
  },
  statusPicker: {
    flexDirection: 'row',
    gap: 12,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  statusOptionActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  restoreButtonModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  restoreButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
});

