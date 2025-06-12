import { URL_IMAGE } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { searchEvents } from "@/redux/slices/EventSlice";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const { width } = Dimensions.get("window");

interface EventResponse {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  type: "PROMOTION" | "TOURNAMENT";
  discountPercent?: number;
  startDate: string; // ISO date string
  endDate: string;
  targetUserType: "MEMBER" | "GUEST" | "STAFF" | "ALL";
  status: "ACTIVE" | "INACTIVE";
  isDeleted: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

const EventsScreen: React.FC = () => {
  const user = useAuth();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    size: 10,
    key: "type",
    value: "",
    status: "ACTIVE",
  });

  const { events, loading } = useSelector((state: any) => state.event);
  useEffect(() => {
    dispatch(searchEvents(searchQuery));
  }, [dispatch, searchQuery]);

  const loadEvents = async () => {
    try {
      dispatch(
        searchEvents({
          page: 1,
          size: 10,
          key: "type",
          value: searchQuery.value,
          status: "ACTIVE",
        })
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách sự kiện");
    } finally {
    }
  };

  const onRefresh = async () => {
    await loadEvents();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "PROMOTION":
        return "#FF6B6B";
      case "TOURNAMENT":
        return "#4ECDC4";
      default:
        return "#667eea";
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case "PROMOTION":
        return "Khuyến mãi";
      case "TOURNAMENT":
        return "Giải đấu";
      default:
        return type;
    }
  };

  const getTargetUserText = (targetUserType: string) => {
    switch (targetUserType) {
      case "ALL":
        return "Tất cả";
      case "MEMBER":
        return "Thành viên";
      case "GUEST":
        return "Khách";
      case "STAFF":
        return "Nhân viên";
      default:
        return targetUserType;
    }
  };

  const renderEventCard = ({ item }: { item: EventResponse }) => (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: URL_IMAGE + item.imageUrl }}
          style={styles.eventImage}
        />
        <View
          style={[
            styles.typeTag,
            { backgroundColor: getEventTypeColor(item.type) },
          ]}
        >
          <Text style={styles.typeText}>{getEventTypeText(item.type)}</Text>
        </View>
        {item.discountPercent && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discountPercent}%</Text>
          </View>
        )}
      </View>

      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.eventDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.eventInfo}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>📅 Từ:</Text>
            <Text style={styles.dateText}>{formatDate(item.startDate)}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>📅 Đến:</Text>
            <Text style={styles.dateText}>{formatDate(item.endDate)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.targetUserContainer}>
            <Text style={styles.targetUserLabel}>👥 Đối tượng:</Text>
            <Text style={styles.targetUserText}>
              {getTargetUserText(item.targetUserType)}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "ACTIVE" ? "#4CAF50" : "#FFC107",
              },
            ]}
          >
            <Text style={styles.statusText}>
              {item.status === "ACTIVE" ? "Đang diễn ra" : "Tạm dừng"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: string, label: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        searchQuery.value === filter && styles.activeFilterButton,
      ]}
      onPress={() =>
        setSearchQuery((prev) => ({
          ...prev,
          value: filter,
        }))
      }
    >
      <Text
        style={[
          styles.filterButtonText,
          searchQuery.value === filter && styles.activeFilterButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎉 Sự kiện</Text>
        <Text style={styles.headerSubtitle}>Khám phá các sự kiện hấp dẫn</Text>
      </View>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {renderFilterButton("ALL", "📋 Tất cả")}
        {renderFilterButton("PROMOTION", "🎁 Khuyến mãi")}
        {renderFilterButton("TOURNAMENT", "🏆 Giải đấu")}
      </ScrollView>

      {/* Events List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Không có sự kiện nào</Text>
            <Text style={styles.emptySubtext}>
              Hãy quay lại sau để xem sự kiện mới
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 8,
  },
  filterContainer: {
    marginVertical: 20,
    paddingBottom: 25,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    height: 50,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeFilterButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  activeFilterButtonText: {
    color: "white",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  typeTag: {
    position: "absolute",
    top: 15,
    left: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  typeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  discountBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  eventContent: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },
  eventInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 12,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 5,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  targetUserContainer: {
    flex: 1,
  },
  targetUserLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 5,
    fontWeight: "500",
  },
  targetUserText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default EventsScreen;
