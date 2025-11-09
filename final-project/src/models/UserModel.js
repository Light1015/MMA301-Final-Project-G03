import { mockUsers } from '../database/db';

// UserModel - manages user operations for admin
// Methods: getAllUsers(), updateUser(email, updates), deleteUser(email), updateUserRole(email, role), updateUserStatus(email, status)

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
};

export default UserModel;

