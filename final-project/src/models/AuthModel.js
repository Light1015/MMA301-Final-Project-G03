import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../database/db';

// Simple AuthModel - mock implementation but persists user using AsyncStorage
// Methods: login(email, password), getCurrentUser(), logout()
const STORAGE_KEY = '@edulinggo_user';

const AuthModel = {
  login: async (email, password) => {
    // Simulate network latency
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const user = mockUsers[email];
        if (user && user.password === password) {
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
};

export default AuthModel;
