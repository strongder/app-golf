"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Booking {
  id: string
  courseName: string
  courseLocation: string
  date: string
  time: string
  players: number
  price: number
  status: "confirmed" | "pending" | "cancelled"
  notes?: string
  bookingCode: string
  createdAt: string
}

export default function BookingHistoryScreen({ navigation }: any) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_BACKEND_URL/api/bookings', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
      // const data = await response.json();
      // setBookings(data);

      // Mock data for demo
      const mockBookings: Booking[] = [
        {
          id: "1",
          courseName: "Sân Golf Long Thành",
          courseLocation: "Đồng Nai",
          date: "2024-01-15",
          time: "08:00",
          players: 2,
          price: 2400000,
          status: "confirmed",
          notes: "Đặt sân cho khách VIP",
          bookingCode: "GLF001234",
          createdAt: "2024-01-10T10:30:00Z",
        },
        {
          id: "2",
          courseName: "Sân Golf Đại Lải",
          courseLocation: "Vĩnh Phúc",
          date: "2024-01-20",
          time: "14:00",
          players: 4,
          price: 6000000,
          status: "pending",
          bookingCode: "GLF001235",
          createdAt: "2024-01-12T14:15:00Z",
        },
        {
          id: "3",
          courseName: "Sân Golf Tân Sơn Nhất",
          courseLocation: "TP.HCM",
          date: "2024-01-10",
          time: "07:30",
          players: 1,
          price: 2000000,
          status: "cancelled",
          bookingCode: "GLF001236",
          createdAt: "2024-01-08T09:20:00Z",
        },
      ]
      setBookings(mockBookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#4CAF50"
      case "pending":
        return "#FF9800"
      case "cancelled":
        return "#F44336"
      default:
        return "#666"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xác nhận"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }
  

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert("Hủy đặt sân", "Bạn có chắc chắn muốn hủy đặt sân này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          try {
            // Replace with your actual API endpoint
            // await fetch(`YOUR_BACKEND_URL/api/bookings/${bookingId}/cancel`, {
            //   method: 'PUT',
            //   headers: {
            //     'Authorization': `Bearer ${token}`,
            //   },
            // });

            // Update local state
            setBookings(
              bookings.map((booking) =>
                booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking,
              ),
            )
            Alert.alert("Thành công", "Đã hủy đặt sân")
          } catch (error) {
            Alert.alert("Lỗi", "Không thể hủy đặt sân")
          }
        },
      },
    ])
  }

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate("HistoryDetail", { booking: item })}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.courseName}>{item.courseName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.courseLocation}>{item.courseLocation}</Text>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{new Date(item.date).toLocaleDateString("vi-VN")}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.players} người</Text>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Ghi chú:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      <View style={styles.bookingFooter}>
        <Text style={styles.price}>{item.price.toLocaleString("vi-VN")} VNĐ</Text>
        {item.status === "confirmed" && (
          <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(item.id)}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tapIndicator}>
        <Ionicons name="chevron-forward" size={16} color="#ccc" />
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử đặt sân</Text>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Chưa có lịch đặt sân nào</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchBookings} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  )
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
})
