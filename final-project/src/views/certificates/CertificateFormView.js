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
  Modal,
  FlatList,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CertificateModel from "../../models/CertificateModel";
import { mockCourses } from "../../database/db";

/**
 * CustomSelect - small internal component to replace default Picker with nicer modal dropdown
 */
const CustomSelect = ({
  label,
  value,
  options = [],
  placeholder = "Select...",
  onSelect,
}) => {
  const [visible, setVisible] = useState(false);
  const selectedLabel = options.find(
    (o) => String(o.value) === String(value)
  )?.label;

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.selectButton}
        accessibilityLabel={label}
      >
        <Text
          style={[styles.selectText, !selectedLabel && { color: "#9CA3AF" }]}
        >
          {selectedLabel || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalWrap}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.modalSeparator} />
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const CertificateFormView = ({ certificateId, onBack, onSaved }) => {
  const isEditMode = !!certificateId;

  const [formData, setFormData] = useState({
    certificateName: "",
    courseId: "",
    courseName: "",
    description: "",
    validityPeriod: "1 year",
    templateDesign: "default",
    issueDate: new Date().toISOString().split("T")[0],
    status: "active",
  });

  const [errors, setErrors] = useState({});

  // options for selects
  const validityOptions = [
    { label: "6 months", value: "6 months" },
    { label: "1 year", value: "1 year" },
    { label: "2 years", value: "2 years" },
    { label: "Lifetime", value: "Lifetime" },
  ];
  const templateOptions = [
    { label: "Default", value: "default" },
    { label: "Premium", value: "premium" },
    { label: "Modern", value: "modern" },
    { label: "Classic", value: "classic" },
  ];
  const courseOptions = mockCourses.map((c) => ({
    label: c.title,
    value: String(c.id),
  }));

  useEffect(() => {
    if (isEditMode) {
      const certificate = CertificateModel.getCertificateById(certificateId);
      if (certificate) {
        setFormData({
          certificateName: certificate.certificateName || "",
          courseId: certificate.courseId ? String(certificate.courseId) : "",
          courseName: certificate.courseName || "",
          description: certificate.description || "",
          validityPeriod: certificate.validityPeriod || "1 year",
          templateDesign: certificate.templateDesign || "default",
          issueDate:
            certificate.issueDate || new Date().toISOString().split("T")[0],
          status: certificate.status || "active",
        });
      } else {
        Alert.alert("Not found", "Certificate to edit was not found", [
          { text: "OK", onPress: onBack },
        ]);
      }
    } else {
      // reset for create
      setFormData({
        certificateName: "",
        courseId: "",
        courseName: "",
        description: "",
        validityPeriod: "1 year",
        templateDesign: "default",
        issueDate: new Date().toISOString().split("T")[0],
        status: "active",
      });
      setErrors({});
    }
  }, [certificateId, isEditMode]);

  const handleCourseSelect = (courseId) => {
    const found = mockCourses.find((c) => String(c.id) === String(courseId));
    setFormData({
      ...formData,
      courseId: courseId,
      courseName: found ? found.title : "",
    });
    setErrors({ ...errors, courseId: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.certificateName.trim())
      newErrors.certificateName = "Certificate name is required";
    if (!formData.courseId) newErrors.courseId = "Please select a course";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert("Validation error", "Please fix required fields");
      return;
    }
    const data = {
      certificateName: formData.certificateName,
      courseId: parseInt(formData.courseId, 10),
      courseName: formData.courseName,
      description: formData.description,
      validityPeriod: formData.validityPeriod,
      templateDesign: formData.templateDesign,
      issueDate: formData.issueDate,
      status: formData.status,
    };

    if (isEditMode) {
      const updated = CertificateModel.updateCertificate(
        Number(certificateId),
        data
      );
      if (updated) {
        if (typeof onSaved === "function") onSaved();
        Alert.alert("Success", "Certificate updated successfully");
      } else {
        Alert.alert("Error", "Failed to update");
      }
    } else {
      CertificateModel.createCertificate(data);
      if (typeof onSaved === "function") onSaved();
      Alert.alert("Success", "Certificate created successfully");
    }
  };

  // helper: set today's date
  const setToday = () => {
    setFormData({
      ...formData,
      issueDate: new Date().toISOString().split("T")[0],
    });
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
            {isEditMode ? "Edit Certificate" : "Create Certificate"}
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
            {/* Certificate name */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Certificate Name *</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.certificateName && styles.inputError,
                ]}
                placeholder="e.g., React Native Developer"
                value={formData.certificateName}
                onChangeText={(t) => {
                  setFormData({ ...formData, certificateName: t });
                  setErrors({ ...errors, certificateName: "" });
                }}
                placeholderTextColor="#9CA3AF"
              />
              {errors.certificateName ? (
                <Text style={styles.errorText}>{errors.certificateName}</Text>
              ) : null}
            </View>

            {/* Course select */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Select Course *</Text>
              <CustomSelect
                label="Course"
                value={formData.courseId}
                options={courseOptions}
                placeholder="Choose a course..."
                onSelect={handleCourseSelect}
              />
              {errors.courseId ? (
                <Text style={styles.errorText}>{errors.courseId}</Text>
              ) : null}
            </View>

            {/* Description - FIXED HEIGHT */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.description && styles.inputError,
                ]}
                placeholder="Describe what this certificate represents..."
                value={formData.description}
                onChangeText={(t) => {
                  setFormData({ ...formData, description: t });
                  setErrors({ ...errors, description: "" });
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
                scrollEnabled={false}
              />
              {errors.description ? (
                <Text style={styles.errorText}>{errors.description}</Text>
              ) : null}
            </View>

            {/* Validity period select */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Validity Period</Text>
              <CustomSelect
                label="Validity Period"
                value={formData.validityPeriod}
                options={validityOptions}
                placeholder="Select validity..."
                onSelect={(val) =>
                  setFormData({ ...formData, validityPeriod: val })
                }
              />
            </View>

            {/* Template design select */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Template Design</Text>
              <CustomSelect
                label="Template Design"
                value={formData.templateDesign}
                options={templateOptions}
                placeholder="Choose template..."
                onSelect={(val) =>
                  setFormData({ ...formData, templateDesign: val })
                }
              />
            </View>

            {/* Issue date: editable on create, read-only on edit */}
            <View style={styles.formRowRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>
                  Issue Date {isEditMode ? "(read-only)" : "*"}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    isEditMode ? styles.inputDisabled : null,
                  ]}
                  value={formData.issueDate}
                  onChangeText={(text) =>
                    !isEditMode && setFormData({ ...formData, issueDate: text })
                  }
                  editable={!isEditMode}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* quick Today button only for create */}
              {!isEditMode && (
                <TouchableOpacity style={styles.todayButton} onPress={setToday}>
                  <Text style={styles.todayButtonText}>Today</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Status toggle (only in edit mode) */}
            {isEditMode && (
              <View style={styles.formRow}>
                <Text style={styles.label}>Status</Text>

                <View style={styles.statusRow}>
                  <Text
                    style={[
                      styles.statusLabel,
                      formData.status === "active"
                        ? styles.statusLabelActive
                        : styles.statusLabelInactive,
                    ]}
                  >
                    {formData.status === "active" ? "Active" : "Inactive"}
                  </Text>

                  <Switch
                    value={formData.status === "active"}
                    onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        status: val ? "active" : "inactive",
                      })
                    }
                    trackColor={{ false: "#FECACA", true: "#BBF7D0" }}
                    thumbColor={
                      Platform.OS === "android"
                        ? formData.status === "active"
                          ? "#16A34A"
                          : "#DC2626"
                        : undefined
                    }
                    ios_backgroundColor="#EEE"
                    accessibilityLabel="Toggle status active or inactive"
                  />
                </View>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsWrap}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.submitText}>
                  {isEditMode ? "Update Certificate" : "Create Certificate"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6F9",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomColor: "#E6E9EE",
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 32,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E8EAEE",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
  },

  formRow: {
    width: "100%",
    marginBottom: 16,
  },
  formRowRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#FAFAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E6E9EE",
    fontSize: 15,
    color: "#111827",
  },
  inputError: {
    borderColor: "#f17676ff",
    backgroundColor: "#FEF2F2",
  },
  inputDisabled: {
    backgroundColor: "#F5F7FA",
    color: "#6B7280",
  },

  // FIXED HEIGHT + scrollEnabled false + width 100%
  textArea: {
    width: "100%", // ✅ THÊM
    height: 100,
    minHeight: 100,
    maxHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  selectButton: {
    width: "100%", // ✅ THÊM
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E6E9EE",
  },
  selectText: {
    flex: 1, // ✅ THÊM
    fontSize: 15,
    color: "#111827",
    marginRight: 8, // ✅ THÊM - space before icon
  },

  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "70%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalItemText: {
    fontSize: 15,
    color: "#111827",
  },
  modalSeparator: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  errorText: {
    color: "#EF4444",
    marginTop: 6,
    fontSize: 13,
  },

  todayButton: {
    marginLeft: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    flexShrink: 0, // ✅ THÊM - prevent shrinking
  },
  todayButtonText: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 14,
  },

  statusRow: {
    width: "100%", // ✅ THÊM
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFB",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E9EE",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "700",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexShrink: 0, // ✅ THÊM
  },
  statusLabelActive: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  statusLabelInactive: {
    backgroundColor: "#FED7AA",
    color: "#7C2D12",
  },

  actionsWrap: {
    width: "100%", // ✅ THÊM
    marginTop: 24,
    gap: 12,
  },
  submitButton: {
    width: "100%", // ✅ THÊM
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
  },
  cancelButton: {
    width: "100%", // ✅ THÊM
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E9EE",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default CertificateFormView;
