// src/views/CouponFormView.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import CouponController from '../../controllers/CouponController';

export default function CouponFormView({ couponId, onBack, onSaved, onRefresh }) {
  const [coupon, setCoupon] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    description: '',
    createdBy: 'Admin User',
  });

  useEffect(() => {
    if (couponId) {
      const loadCoupon = async () => {
        const data = await CouponController.getById(couponId);
        if (data) setCoupon(data);
      };
      loadCoupon();
    }
  }, [couponId]);

  const handleSave = async () => {
    if (couponId) await CouponController.update(couponId, coupon);
    else await CouponController.create(coupon);

    onSaved?.();      // để AdminDashboard thay view
    onRefresh?.();    // refresh danh sách CouponListView
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{couponId ? 'Edit Coupon' : 'Add Coupon'}</Text>

      <TextInput
        placeholder="Code"
        value={coupon.code}
        onChangeText={(text) => setCoupon({ ...coupon, code: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Discount %"
        keyboardType="numeric"
        value={String(coupon.discount)}
        onChangeText={(text) => setCoupon({ ...coupon, discount: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Expiry Date (YYYY-MM-DD)"
        value={coupon.expiryDate}
        onChangeText={(text) => setCoupon({ ...coupon, expiryDate: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={coupon.description}
        onChangeText={(text) => setCoupon({ ...coupon, description: text })}
        style={styles.input}
      />

      <Button title="Save" onPress={handleSave} />
      <Button title="Back" color="gray" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, paddingVertical: 5 },
});
