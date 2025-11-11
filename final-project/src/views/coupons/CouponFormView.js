import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CouponController from "../../controllers/CouponController";

const CouponFormView = ({ couponId, onBack, onSaved, onRefresh }) => {
  const isEditMode = !!couponId;

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expiryDate: "",
    description: "",
    createdBy: "Admin User",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const loadCoupon = async () => {
        const data = await CouponController.getById(couponId);
        if (data) {
          setFormData({
            code: data.code || "",
            discount: String(data.discount || ""),
            expiryDate: data.expiryDate || "",
            description: data.description || "",
            createdBy: data.createdBy || "Admin User",
          });
        } else {
          Alert.alert("Not found", "Coupon to edit was not found", [
            { text: "OK", onPress: onBack },
          ]);
        }
      };
      loadCoupon();
    } else {
      // reset for create
      setFormData({
        code: "",
        discount: "",
        expiryDate: "",
        description: "",
        createdBy: "Admin User",
      });
      setErrors({});
    }
  }, [couponId, isEditMode]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "Coupon code is required";
    if (!formData.discount.trim()) {
      newErrors.discount = "Discount is required";
    } else if (isNaN(formData.discount) || Number(formData.discount) <= 0) {
      newErrors.discount = "Discount must be a positive number";
    }
    if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation error", "Please fix required fields");
      return;
    }

    const data = {
      code: formData.code,
      discount: Number(formData.discount),
      expiryDate: formData.expiryDate,
      description: formData.description,
      createdBy: formData.createdBy,
    };

    if (isEditMode) {
      await CouponController.update(couponId, data);
      onSaved?.();
      onRefresh?.();
      Alert.alert("Success", "Coupon updated successfully");
    } else {
      await CouponController.create(data);
      onSaved?.();
      onRefresh?.();
      Alert.alert("Success", "Coupon created successfully");
    }
  };

  // helper: set today's date
  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData({ ...formData, expiryDate: today });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? "Edit Coupon" : "Create Coupon"}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form ScrollView */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Coupon code */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Coupon Code *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.code && styles.inputError,
                ]}
                placeholder="e.g., SAVE20"
                value={formData.code}
                onChangeText={(t) => {
                  setFormData({ ...formData, code: t });
                  setErrors({ ...errors, code: "" });
                }}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
              />
              {errors.code ? (
                <Text style={styles.errorText}>{errors.code}</Text>
              ) : null}
            </View>

            {/* Discount */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Discount (%) *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.discount && styles.inputError,
                ]}
                placeholder="e.g., 20"
                value={formData.discount}
                onChangeText={(t) => {
                  setFormData({ ...formData, discount: t });
                  setErrors({ ...errors, discount: "" });
                }}
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              {errors.discount ? (
                <Text style={styles.errorText}>{errors.discount}</Text>
              ) : null}
            </View>

            {/* Expiry date */}
            <View style={styles.formRowRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Expiry Date (YYYY-MM-DD) *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.expiryDate && styles.inputError,
                  ]}
                  placeholder="YYYY-MM-DD"
                  value={formData.expiryDate}
                  onChangeText={(t) => {
                    setFormData({ ...formData, expiryDate: t });
                    setErrors({ ...errors, expiryDate: "" });
                  }}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.expiryDate ? (
                  <Text style={styles.errorText}>{errors.expiryDate}</Text>
                ) : null}
              </View>

              <TouchableOpacity style={styles.todayButton} onPress={setToday}>
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the coupon offer..."
                value={formData.description}
                onChangeText={(t) => {
                  setFormData({ ...formData, description: t });
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
                scrollEnabled={false}
              />
            </View>

            {/* Created By (read-only) */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Created By</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={formData.createdBy}
                editable={false}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </ScrollView>

        {/* Submit button fixed at bottom */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons
              name={isEditMode ? "checkmark-circle" : "add-circle"}
              size={22}
              color="#fff"
            />
            <Text style={styles.submitButtonText}>
              {isEditMode ? "Update Coupon" : "Create Coupon"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F6F9" },
  keyboardView: { flex: 1 },
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

  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E8EAEE",
    elevation: 2,
  },

  formRow: { marginBottom: 20 },
  formRowRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FAFAFA",
  },
  inputError: { borderColor: "#EF4444" },
  inputDisabled: { backgroundColor: "#F3F4F6", color: "#9CA3AF" },

  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  todayButton: {
    marginLeft: 10,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  todayButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  errorText: {
    fontSize: 13,
    color: "#EF4444",
    marginTop: 6,
  },

  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
    }),
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CouponFormView;
