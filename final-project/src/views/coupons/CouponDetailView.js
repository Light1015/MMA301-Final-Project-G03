import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CouponController from "../../controllers/CouponController";

const CouponDetailView = ({ couponId, onBack, onEdit, onDeleted, onRefresh }) => {
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    loadCoupon();
  }, [couponId]);

  const loadCoupon = async () => {
    const data = await CouponController.getById(couponId);
    setCoupon(data || null);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Coupon",
      "Are you sure you want to delete this coupon? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await CouponController.remove(couponId);
            onRefresh?.();
            onBack?.();
          },
        },
      ]
    );
  };

  if (!coupon) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#4F46E5" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Coupon Details</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.centerEmpty}>
              <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
              <Text style={styles.emptyText}>Coupon not found</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#4F46E5" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Coupon Details</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.preview}>
                <Ionicons name="pricetag" size={72} color="#10B981" />
                <Text style={styles.title}>{coupon.code}</Text>
                <Text style={styles.subtitle}>{coupon.discount}% OFF</Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="pricetag" size={22} color="#10B981" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Coupon Code</Text>
                    <Text style={styles.infoValue}>{coupon.code}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="percent" size={22} color="#F59E0B" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Discount</Text>
                    <Text style={styles.infoValue}>{coupon.discount}%</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons
                      name="information-circle"
                      size={22}
                      color="#4F46E5"
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Description</Text>
                    <Text style={styles.infoValue}>
                      {coupon.description || "—"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="calendar" size={22} color="#EF4444" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Expiry Date</Text>
                    <Text style={styles.infoValue}>
                      {coupon.expiryDate || "—"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="person" size={22} color="#8B5CF6" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Created By</Text>
                    <Text style={styles.infoValue}>
                      {coupon.createdBy || "—"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => onEdit(couponId)}
                >
                  <Ionicons name="create" size={18} color="#fff" />
                  <Text style={styles.editText}>Edit Coupon</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash" size={18} color="#fff" />
                  <Text style={styles.deleteText}>Delete Coupon</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F6F9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomColor: "#E6E9EE",
    borderBottomWidth: 1,
  },
  backButton: { padding: 6 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
    textAlign: "center",
  },
  placeholder: { width: 32 },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
  },
  statusText: { fontSize: 12, fontWeight: "700", color: "#065F46" },

  scrollContainer: { padding: 20, alignItems: "center", paddingBottom: 40 },
  card: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E8EAEE",
    elevation: 3,
  },

  preview: { alignItems: "center", paddingVertical: 18, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: "800", color: "#111827", marginTop: 12 },
  subtitle: { fontSize: 18, color: "#10B981", marginTop: 4, fontWeight: "600" },

  infoCard: { marginTop: 12, borderRadius: 10, overflow: "hidden" },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 13, color: "#9CA3AF", fontWeight: "600" },
  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    marginTop: 6,
  },

  actions: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  editText: { color: "#fff", fontWeight: "700", marginLeft: 8 },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  deleteText: { color: "#fff", fontWeight: "700", marginLeft: 8 },

  centerEmpty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
});

export default CouponDetailView;
