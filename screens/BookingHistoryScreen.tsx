"use client";

import { useState, useEffect } from "react";
import { BookingFinish } from "../component/BookingFinish";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { searchBooking } from "@/redux/slices/BookingSlice";
import { useAuth } from "@/contexts/AuthContext";

// Nhận route để lấy params từ navigation.navigate
export default function BookingHistoryScreen({ navigation, route }: any) {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<any>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastBookingInfo, setLastBookingInfo] = useState<any>(null);
  const dispath = useDispatch();
  const { searchBookingResult } = useSelector((state: any) => state.booking);

  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState({
    userId: user?.id,
    status: "",
    page: 1,
    size: 10,
  });

  // Lắng nghe param từ navigation để hiện modal thành công
  useEffect(() => {
    if (route?.params?.bookingSuccess) {
      setShowSuccessModal(true);
      setLastBookingInfo(route.params.bookingInfo);
      // Xóa param để tránh hiện lại khi back
      navigation.setParams({
        bookingSuccess: undefined,
        bookingInfo: undefined,
      });
    }
  }, [route?.params]);
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const action: any = await dispath(searchBooking(searchQuery));
      // Nếu page === 1 thì reset, nếu page > 1 thì nối
      if (searchQuery.page === 1) {
        setBookings(action.payload || []);
      } else {
        setBookings((prev) => [...prev, ...(action.payload || [])]);
      }
      setLoading(false);
    };
    fetch();

    console.log("Search Query:", searchQuery);
  }, [searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#FF9800"; // Cam
      case "CONFIRMED":
        return "#1976d2"; // Xanh dương
      case "PLAYING":
        return "#4CAF50"; // Xanh lá
      case "COMPLETED":
        return "#9E9E9E"; // Xám
      case "CANCELED":
        return "#F44336"; // Đỏ
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã đặt cọc";
      case "PLAYING":
        return "Đang chơi";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setSearchQuery((prev) => ({
      ...prev,
      status: status === "all" ? "" : status,
      page: 1, 
    }));
    
  };

  const renderBookingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate("HistoryDetail", { booking: item })}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.courseName}>{item?.golfCourse?.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item?.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item?.status)}</Text>
        </View>
      </View>

      <Text style={styles.courseLocation}>{item?.golfCourse?.location}</Text>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item?.bookingDate)?.toLocaleDateString("vi-VN")}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item?.teeTime?.startTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item?.numPlayers} người</Text>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Ghi chú:</Text>
          <Text style={styles.notesText}>{item?.notes}</Text>
        </View>
      )}

      <View style={styles.bookingFooter}>
        <Text style={styles.price}>
          {item?.totalCost?.toLocaleString("vi-VN")} VNĐ
        </Text>
        {item.status === "confirmed" && (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tapIndicator}>
        <Ionicons name="chevron-forward" size={16} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BookingFinish
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        bookingInfo={lastBookingInfo}
        onPay={() => setShowSuccessModal(false)}
        onViewHistory={() => setShowSuccessModal(false)}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử đặt sân</Text>
      </View>

      {/* Bộ lọc trạng thái */}
      <View style={{ marginVertical: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
        >
          {[
            { label: "Tất cả", value: "all" },
            { label: "Chờ xác nhận", value: "PENDING" },
            { label: "Đã đặt cọc", value: "CONFIRMED" },
            { label: "Đang chơi", value: "PLAYING" },
            { label: "Hoàn thành", value: "COMPLETED" },
            { label: "Đã hủy", value: "CANCELED" },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor:
                  selectedStatus === item.value ? "#2E7D32" : "#eee",
                marginHorizontal: 2,
              }}
              onPress={() => handleStatusChange(item.value)}
            >
              <Text
                style={{
                  color: selectedStatus === item.value ? "white" : "#333",
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {bookings && bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                setSearchQuery((prev) => ({ ...prev, page: 1 }));
              }}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (
              !loading &&
              bookings.length >= searchQuery.size * searchQuery.page
            ) {
              setSearchQuery((prev) => ({ ...prev, page: prev.page + 1 }));
            }
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Chưa có lịch đặt sân nào</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Chưa có lịch đặt sân nào</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  listContainer: {
    padding: 15,
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  courseLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  bookingDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  notesContainer: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 2,
  },
  notesText: {
    fontSize: 14,
    color: "#333",
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  tapIndicator: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -8 }],
  },
});
