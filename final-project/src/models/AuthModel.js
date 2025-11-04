import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers, DEFAULT_PASSWORD } from '../database/db';

// Simple AuthModel - mock implementation but persists user using AsyncStorage
// Methods: login(email, password), getCurrentUser(), logout()
const STORAGE_KEY = '@edulinggo_user';

const AuthModel = {
  login: async (email, password) => {
    // Simulate network latency
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (password === DEFAULT_PASSWORD && mockUsers[email]) {
          const user = mockUsers[email];
          try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          } catch (e) {
            // ignore storage error for now
          }
          resolve(user);
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
