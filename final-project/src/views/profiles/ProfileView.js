import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserModel from "../../models/UserModel";

export default function ProfileView({ user, onBack, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  // Default avatar if not provided
  const defaultAvatar =
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=face";

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar || defaultAvatar,
  });

  const handleSave = async () => {
    try {
      await UserModel.updateUser(user.email, formData);
      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false);

      // Notify parent component about profile update
      if (onProfileUpdate) {
        onProfileUpdate({ ...user, ...formData });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar || defaultAvatar,
    });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        {!isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={24} color="#4F46E5" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: formData.avatar || defaultAvatar }}
            style={styles.avatar}
            defaultSource={{ uri: defaultAvatar }}
          />
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role}</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="person-outline" size={16} color="#6B7280" /> Name
            </Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                placeholder="Enter your name"
              />
            ) : (
              <Text style={styles.value}>{user.name}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="mail-outline" size={16} color="#6B7280" /> Email
            </Text>
            <Text style={styles.value}>{user.email}</Text>
            {isEditing && (
              <Text style={styles.hint}>Email cannot be changed</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />{" "}
              Joined Date
            </Text>
            <Text style={styles.value}>{user.joinedDate}</Text>
          </View>

          {isEditing && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Ionicons name="image-outline" size={16} color="#6B7280" />{" "}
                Avatar URL
              </Text>
              <TextInput
                style={styles.input}
                value={formData.avatar}
                onChangeText={(text) =>
                  setFormData({ ...formData, avatar: text })
                }
                placeholder="Enter avatar URL"
              />
              <Text style={styles.hint}>Leave blank to use default avatar</Text>
            </View>
          )}
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#4F46E5",
  },
  roleBadge: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  roleText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  formContainer: {
    padding: 16,
  },
  fieldContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: "#1F2937",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  hint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  statusSelector: {
    flexDirection: "row",
    gap: 12,
  },
  statusOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  statusOptionActive: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  statusDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4F46E5",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
