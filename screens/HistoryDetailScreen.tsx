"use client"

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native"
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

export default function HistoryDetailScreen({ route, navigation }: any) {
  const { booking }: { booking: Booking } = route.params

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

  const handleCancelBooking = () => {
    Alert.alert("Hủy đặt sân", "Bạn có chắc chắn muốn hủy đặt sân này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: () => {
          // Handle cancel booking logic
          Alert.alert("Thành công", "Đã hủy đặt sân", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ])
        },
      },
    ])
  }

  const handleRebooking = () => {
    navigation.navigate("Home", {
      screen: "CourseDetail",
      params: {
        course: {
          id: booking.id,
          name: booking.courseName,
          location: booking.courseLocation,
          price: booking.price / booking.players,
        },
      },
    })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
            <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
          </View>
          <Text style={styles.bookingCode}>Mã đặt sân: {booking.bookingCode}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin sân golf</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="golf-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Tên sân:</Text>
              <Text style={styles.infoValue}>{booking.courseName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Địa điểm:</Text>
              <Text style={styles.infoValue}>{booking.courseLocation}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết đặt sân</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Ngày chơi:</Text>
              <Text style={styles.infoValue}>{new Date(booking.date).toLocaleDateString("vi-VN")}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Giờ chơi:</Text>
              <Text style={styles.infoValue}>{booking.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Số người:</Text>
              <Text style={styles.infoValue}>{booking.players}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="create-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Ngày đặt:</Text>
              <Text style={styles.infoValue}>{new Date(booking.createdAt).toLocaleDateString("vi-VN")}</Text>
            </View>
          </View>
        </View>

        {booking.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{booking.notes}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Giá mỗi người:</Text>
              <Text style={styles.paymentValue}>{(booking.price / booking.players).toLocaleString("vi-VN")} VNĐ</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Số người:</Text>
              <Text style={styles.paymentValue}>{booking.players}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>{booking.price.toLocaleString("vi-VN")} VNĐ</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          {booking.status === "confirmed" && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
              <Ionicons name="close-circle-outline" size={20} color="white" />
              <Text style={styles.cancelButtonText}>Hủy đặt sân</Text>
            </TouchableOpacity>
          )}

          {booking.status === "cancelled" && (
            <TouchableOpacity style={styles.rebookButton} onPress={handleRebooking}>
              <Ionicons name="refresh-outline" size={20} color="white" />
              <Text style={styles.rebookButtonText}>Đặt lại</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call-outline" size={20} color="#2E7D32" />
            <Text style={styles.contactButtonText}>Liên hệ hỗ trợ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusContainer: {
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookingCode: {
    fontSize: 14,
    color: "#666",
    fontFamily: "monospace",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  notesCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notesText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#666",
  },
  paymentValue: {
    fontSize: 14,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  actionSection: {
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  rebookButton: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  rebookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  contactButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  contactButtonText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})
