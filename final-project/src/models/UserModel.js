import { mockUsers } from '../database/db';
import AsyncStorage from '@react-native-async-storage/async-storage';

// UserModel - manages user operations for admin
// Methods: getAllUsers(), updateUser(email, updates), deleteUser(email), updateUserRole(email, role), updateUserStatus(email, status)

const PASSWORDS_STORAGE_KEY = '@edulinggo_passwords';

// Helper function to get stored passwords
const getStoredPasswords = async () => {
  try {
    const stored = await AsyncStorage.getItem(PASSWORDS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

// Helper function to save passwords
const saveStoredPasswords = async (passwords) => {
  try {
    await AsyncStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(passwords));
  } catch (e) {
    console.error('Failed to save passwords', e);
  }
};

// Initialize users with stored passwords on import
const initializePasswords = async () => {
  const storedPasswords = await getStoredPasswords();
  Object.keys(storedPasswords).forEach(email => {
    if (mockUsers[email]) {
      mockUsers[email].password = storedPasswords[email];
    }
  });
};

// Call initialization
initializePasswords();

const UserModel = {
  // Get all users
  getAllUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = Object.values(mockUsers);
        resolve(users);
      }, 300);
    });
  },

  // Update user information
  updateUser: async (email, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers[email]) {
          mockUsers[email] = { ...mockUsers[email], ...updates };
          resolve(mockUsers[email]);
        } else {
          reject({ message: 'User not found' });
        }
      }, 300);
    });
  },

  // Delete user
  deleteUser: async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers[email]) {
          delete mockUsers[email];
          resolve({ success: true });
        } else {
          reject({ message: 'User not found' });
        }
      }, 300);
    });
  },

  // Update user role
  updateUserRole: async (email, role) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers[email]) {
          mockUsers[email].role = role;
          resolve(mockUsers[email]);
        } else {
          reject({ message: 'User not found' });
        }
      }, 300);
    });
  },

  // Update user status (available/unavailable)
  updateUserStatus: async (email, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers[email]) {
          mockUsers[email].status = status;
          resolve(mockUsers[email]);
        } else {
          reject({ message: 'User not found' });
        }
      }, 300);
    });
  },

  // Change user password
  changePassword: async (email, currentPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        if (!mockUsers[email]) {
          reject({ message: 'User not found' });
          return;
        }

        if (mockUsers[email].password !== currentPassword) {
          reject({ message: 'Current password is incorrect' });
          return;
        }

        if (newPassword.length < 6) {
          reject({ message: 'New password must be at least 6 characters' });
          return;
        }

        // Update password in memory
        mockUsers[email].password = newPassword;

        // Persist password to AsyncStorage
        const storedPasswords = await getStoredPasswords();
        storedPasswords[email] = newPassword;
        await saveStoredPasswords(storedPasswords);

        resolve({ success: true, message: 'Password changed successfully' });
      }, 300);
    });
  },
};

export default UserModel;

