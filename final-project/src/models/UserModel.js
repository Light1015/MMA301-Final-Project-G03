import { mockUsers, getNextUserId } from '../database/db';

// UserModel - manages user operations for admin
// Methods: getAllUsers(), addUser(userData), updateUser(email, updates), deleteUser(email), updateUserRole(email, role), updateUserStatus(email, status)

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

  // Add new user
  addUser: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { email, name, role, password } = userData;
        
        // Validate required fields
        if (!email || !name || !role || !password) {
          reject({ message: 'All fields are required' });
          return;
        }

        // Check if user already exists
        if (mockUsers[email]) {
          reject({ message: 'User with this email already exists' });
          return;
        }

        // Create new user
        const newUser = {
          id: getNextUserId(),
          email,
          name,
          role,
          password,
          status: 'available',
          avatar: `https://via.placeholder.com/100x100.png?text=${name.charAt(0).toUpperCase()}`,
          joinedDate: new Date().toISOString().split('T')[0],
        };

        // Add role-specific fields
        if (role === 'Learner') {
          newUser.enrolledCourses = 0;
          newUser.completedCourses = 0;
        } else if (role === 'Teacher') {
          newUser.coursesTaught = 0;
          newUser.students = 0;
        }

        mockUsers[email] = newUser;
        resolve(newUser);
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

