// src/models/CouponModel.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockCoupons } from '../database/collections/coupons';

const STORAGE_KEY = 'COUPONS_DB';

const CouponModel = {
  async initData() {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existing) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockCoupons));
    }
  },

  async getAll() {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async getById(id) {
    const data = await this.getAll();
    return data.find(item => item.id === id);
  },

  async create(coupon) {
    const data = await this.getAll();
    const newCoupon = {
      ...coupon,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    data.push(newCoupon);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return newCoupon;
  },

  async update(id, updatedCoupon) {
    const data = await this.getAll();
    const index = data.findIndex(c => c.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updatedCoupon };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data[index];
  },

  async remove(id) {
    const data = await this.getAll();
    const filtered = data.filter(c => c.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};

export default CouponModel;
