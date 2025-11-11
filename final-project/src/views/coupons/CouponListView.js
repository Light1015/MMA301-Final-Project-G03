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
import CouponController from "../../controllers/CouponController";

const CouponListView = ({
  onNavigateToForm,
  onViewDetail,
  refreshToken = 0,
  onBack,
}) => {
  const [coupons, setCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  const loadCoupons = useCallback(async () => {
    const data = await CouponController.getAll();
    setCoupons(data);
    setFilteredCoupons(data);
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons, refreshToken]);

  useEffect(() => {
    if (searchQuery) {
      const results = coupons.filter(
        (coupon) =>
          coupon.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coupon.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCoupons(results);
    } else {
      setFilteredCoupons(coupons);
    }
  }, [searchQuery, coupons]);

  const handleDelete = async (id, code) => {
    Alert.alert(
      "Delete Coupon",
      `Are you sure you want to delete "${code}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await CouponController.remove(id);
            loadCoupons();
          },
        },
      ]
    );
  };

  const renderCoupon = ({ item }) => (
    <View style={styles.couponCard}>
      <View style={styles.cardHeader}>
        <View style={styles.couponIcon}>
          <Ionicons name="pricetag" size={32} color="#10B981" />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.couponCode}>{item.code}</Text>
          <Text style={styles.discount}>{item.discount}% OFF</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>ACTIVE</Text>
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
          <Text style={styles.infoText}>Expires: {item.expiryDate || "—"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>
            By: {item.createdBy || "—"}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => onViewDetail(item.id)}
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
          onPress={() => handleDelete(item.id, item.code)}
        >
          <Ionicons name="trash-outline" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            accessibilityLabel="Back to home"
          >
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </TouchableOpacity>
        )}
        <View style={styles.headerLeft}>
          <Ionicons name="pricetags" size={32} color="#4F46E5" />
          <Text style={styles.headerTitle}>Coupon Management</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onNavigateToForm(null)}
          accessibilityLabel="Create coupon"
        >
          <Ionicons name="add-circle" size={32} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search coupons..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
          accessibilityLabel="Search coupons"
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
        data={filteredCoupons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCoupon}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No coupons found</Text>
            <Text style={styles.emptySubtext}>
              Create your first coupon to get started
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  flatList: {
    flex: 1,
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
  backButton: {
    padding: 8,
    marginRight: 8,
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
  couponCard: {
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
  couponIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  discount: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
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

export default CouponListView;
