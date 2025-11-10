import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import CouponController from '../../controllers/CouponController';

export default function CouponListView({ onBack, onNavigateToForm, onViewDetail }) {
  const [coupons, setCoupons] = useState([]);

  const loadCoupons = useCallback(async () => {
    const data = await CouponController.getAll();
    setCoupons(data);
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Coupon Management</Text>

      <Button title="Add Coupon" onPress={() => onNavigateToForm(null)} />

      <View style={styles.list}>
        {coupons.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#6B7280' }}>No coupons found.</Text>
        ) : (
          coupons.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => onViewDetail(item.id)}
            >
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.discount}>Discount: {item.discount}%</Text>
              <Text style={styles.text}>Expires: {item.expiryDate}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.createdBy}>Created by: {item.createdBy}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <Button title="Back" color="gray" onPress={onBack} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
        flexGrow: 1,
        alignItems: 'stretch',
    },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    list: { marginVertical: 16 },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 8,
        borderRadius: 6,
        backgroundColor: '#F9FAFB',
    },
    code: { fontSize: 18, fontWeight: 'bold' },
    discount: { fontSize: 16 },
    text: { fontSize: 16 },
    description: { fontSize: 14, color: '#6B7280', marginTop: 4 },
    createdBy: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
});
