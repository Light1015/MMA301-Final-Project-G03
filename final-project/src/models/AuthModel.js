import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../database/db';

// Simple AuthModel - mock implementation but persists user using AsyncStorage
// Methods: login(email, password), getCurrentUser(), logout()
const STORAGE_KEY = '@edulinggo_user';
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

const AuthModel = {
  login: async (email, password) => {
    // Simulate network latency
    return new Promise(async (resolve, reject) => {
      // Load any stored password changes
      const storedPasswords = await getStoredPasswords();

      setTimeout(async () => {
        const user = mockUsers[email];
        if (!user) {
          reject({ message: 'Invalid credentials' });
          return;
        }

        // Check stored password first, fall back to default
        const actualPassword = storedPasswords[email] || user.password;

        if (actualPassword === password) {
          // Check if user is available
          if (user.status === 'unavailable') {
            reject({ message: 'Account is unavailable. Please contact administrator.' });
            return;
          }
          try {
            // Remove password from user object before storing
            const { password: _, ...userWithoutPassword } = user;
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
          } catch (e) {
            // ignore storage error for now
          }
          const { password: _, ...userWithoutPassword } = user;
          resolve(userWithoutPassword);
        } else {
          reject({ message: 'Invalid credentials' });
        }
      }, 800);
    });
  },

  getCurrentUser: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  },

  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // Business Rule 1: Email must be unique
        if (mockUsers[userData.email]) {
          reject({ message: 'Email already exists', field: 'email' });
          return;
        }

        // Business Rule 2: Generate new user ID
        const existingIds = Object.values(mockUsers).map(u => u.id);
        const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

        // Business Rule 3: Set default values based on role
        const newUser = {
          id: newId,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role || 'Learner', // Default role is Learner
          avatar: userData.avatar || `https://via.placeholder.com/100x100.png?text=${userData.name.charAt(0)}`,
          joinedDate: new Date().toISOString().split('T')[0], // Current date
          status: 'available', // Default status
        };

        // Business Rule 4: Add role-specific fields
        if (newUser.role === 'Learner') {
          newUser.enrolledCourses = 0;
          newUser.completedCourses = 0;
        } else if (newUser.role === 'Teacher') {
          newUser.coursesTaught = 0;
          newUser.students = 0;
        }
        // Admin has no additional fields

        // Business Rule 5: Save to mock database
        mockUsers[userData.email] = newUser;

        // Business Rule 6: Return user without password (NO auto-login)
        // User cần login manually sau khi đăng ký
        const { password: _, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      }, 800);
    });
  },
};

export default AuthModel;
