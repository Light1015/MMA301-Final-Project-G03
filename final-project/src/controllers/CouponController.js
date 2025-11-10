// src/controllers/CouponController.js
import CouponModel from '../models/CouponModel';

const CouponController = {
  async getAll() {
    await CouponModel.initData();
    return await CouponModel.getAll();
  },

  async getById(id) {
    return await CouponModel.getById(id);
  },

  async create(coupon) {
    return await CouponModel.create(coupon);
  },

  async update(id, coupon) {
    return await CouponModel.update(id, coupon);
  },

  async remove(id) {
    return await CouponModel.remove(id);
  },
};

export default CouponController;
