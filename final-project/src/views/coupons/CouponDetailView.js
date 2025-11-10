// src/views/CouponDetailView.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert  } from 'react-native';
import CouponController from '../../controllers/CouponController';

export default function CouponDetailView({ couponId, onBack, onEdit, onDeleted, onRefresh }) {
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const loadCoupon = async () => {
      const data = await CouponController.getById(couponId);
      setCoupon(data);
    };
    loadCoupon();
  }, [couponId]);

const handleDelete = () => {
  Alert.alert(
    "Delete Coupon",
    "Are you sure you want to delete this coupon?",
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "OK", 
        onPress: async () => {
          await CouponController.remove(couponId);
          // Call refresh for list
          onRefresh?.();
          // Navigate back to list immediately
          onBack?.();
        } 
      }
    ]
  );
};


  if (!coupon) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.code}>{coupon.code}</Text>
      <Text style={styles.text}>Discount: {coupon.discount}%</Text>
      <Text style={styles.text}>Expiry: {coupon.expiryDate}</Text>
      <Text style={styles.text}>Description: {coupon.description}</Text>
      <Text style={styles.text}>Created By: {coupon.createdBy}</Text>

      <Button title="Edit" onPress={() => onEdit(couponId)} />
      <Button title="Delete" color="red" onPress={handleDelete} />
      <Button title="Back" color="gray" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  code: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5 },
});
