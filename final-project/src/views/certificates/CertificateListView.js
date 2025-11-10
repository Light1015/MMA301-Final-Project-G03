import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CertificateModel from "../../models/CertificateModel";

const CertificateListView = ({
  onNavigateToForm,
  onNavigateToDetail,
  refreshToken = 0,
}) => {
  const [certificates, setCertificates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState([]);

  const loadCertificates = useCallback(() => {
    const data = CertificateModel.getAllCertificates();
    setCertificates(data);
    setFilteredCertificates(
      searchQuery ? CertificateModel.searchCertificates(searchQuery) : data
    );
  }, [searchQuery]);

  useEffect(() => {
    // initial load and when refreshToken changes
    loadCertificates();
  }, [loadCertificates, refreshToken]);

  useEffect(() => {
    if (searchQuery) {
      const results = CertificateModel.searchCertificates(searchQuery);
      setFilteredCertificates(results);
    } else {
      setFilteredCertificates(certificates);
    }
  }, [searchQuery, certificates]);

  const handleDelete = (id, name) => {
    Alert.alert(
      "Delete Certificate",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            CertificateModel.deleteCertificate(id);
            loadCertificates();
          },
        },
      ]
    );
  };

  const renderCertificate = ({ item }) => (
    <View style={styles.certificateCard}>
      <View style={styles.cardHeader}>
        <View style={styles.certificateIcon}>
          <Ionicons name="ribbon" size={32} color="#FFD700" />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.certificateName}>{item.certificateName}</Text>
          <Text style={styles.courseName}>{item.courseName}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === "active"
              ? styles.activeStatus
              : styles.inactiveStatus,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status !== "active" && { color: "#7C2D12" },
            ]}
          >
            {(item.status || "").toUpperCase()}
          </Text>
        </View>
      </View>

      {item.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>Issued: {item.issueDate || "—"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>
            Valid: {item.validityPeriod || "—"}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => onNavigateToDetail(item.id)}
        >
          <Ionicons name="eye-outline" size={18} color="#4F46E5" />
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onNavigateToForm(item.id)}
        >
          <Ionicons name="create-outline" size={18} color="#FFF" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.certificateName)}
        >
          <Ionicons name="trash-outline" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={32} color="#4F46E5" />
          <Text style={styles.headerTitle}>Certificate Management</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onNavigateToForm(null)}
          accessibilityLabel="Create certificate"
        >
          <Ionicons name="add-circle" size={32} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search certificates..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
          accessibilityLabel="Search certificates"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.listContainer}
        data={filteredCertificates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCertificate}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false} // safer for complex items
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No certificates found</Text>
            <Text style={styles.emptySubtext}>
              Create your first certificate to get started
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // ensure list screen fills available height
    backgroundColor: "#F8FAFC",
  },
  flatList: {
    flex: 1, // allow FlatList to expand (avoid nested small scroll views)
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 12,
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  certificateCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  certificateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  courseName: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: "#D1FAE5",
  },
  inactiveStatus: {
    backgroundColor: "#FED7AA",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#065F46",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  viewButtonText: {
    color: "#4F46E5",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#4F46E5",
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  editButtonText: {
    color: "#FFFFFF",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EF4444",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
});

export default CertificateListView;
