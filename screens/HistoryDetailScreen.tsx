import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { getBookingDetailByBookingId } from "@/redux/slices/BookingSlice";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { createVnPayPayment } from "@/redux/slices/PaymentSlice";

// Định nghĩa kiểu dữ liệu cho booking
interface BookingResponse {
  id: string;
  bookingCode: string;
  phone: string;
  fullName: string;
  email: string;
  golferId: string | null;
  userId: string;
  golfCourse: {
    id: string;
    name: string;
    location?: string;
  };
  bookingDate: string;
  teeTime: {
    id: string;
    startTime: string;
  };
  numPlayers: number;
  numberOfHoles: number;
  status: string; // PENDING, CONFIRMED, PLAYING, COMPLETED, CHECKED_OUT, CANCELLED
  checkInTime: string | null;
  checkOutTime: string | null;
  depositAmount: number;
  checkInBy: string | null;
  priceByCourse: number;
  priceByService: number;
  discountPromotion: number;
  discountMembership: number;
  totalCost: number;
  checkOutBy: string | null;
  note: string;
  paymentMethod: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingDetail {
  id: string;
  service: {
    id: string;
    name: string;
    type: string;
    price: number;
  };
  tool?: {
    id: string;
    rentPrice: number;
  };
  quantity: number;
  totalPrice: number;
}

export default function HistoryDetailScreen({ route, navigation }: any) {
  console.log("123456789", route.params);
  const dispatch = useDispatch();
  const { booking } = route.params || {};
  // const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [bookingDetail, setBookingDetail] = useState<BookingDetail[]>([]);

  const getBookingDetailByBoooking = async (bookingId: any) => {
    const res = await dispatch(getBookingDetailByBookingId(bookingId)).unwrap();
    setBookingDetail(res);
  };

  useEffect(() => {
    if (!booking.id) {
      getBookingDetailByBoooking(booking.id);
    }
  }, [booking.id, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "#4CAF50";
      case "PENDING":
        return "#FF9800";
      case "CANCELLED":
        return "#F44336";
      case "PLAYING":
        return "#2196F3";
      case "COMPLETED":
        return "#9C27B0";
      case "CHECKED_OUT":
        return "#607D8B";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PENDING":
        return "Chờ xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      case "PLAYING":
        return "Đang chơi";
      case "COMPLETED":
        return "Hoàn thành";
      case "CHECKED_OUT":
        return "Đã trả sân";
      default:
        return "Không xác định";
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "Tiền mặt";
      case "VNPay":
        return "VNPay";
      default:
        return method;
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "0 VNĐ";
    return price.toLocaleString("vi-VN") + " VNĐ";
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateTimeString: string | undefined) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return (
      date.toLocaleDateString("vi-VN") +
      " " +
      date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  // const handleCancelBooking = () => {
  //   Alert.alert("Hủy đặt sân", "Bạn có chắc chắn muốn hủy đặt sân này?", [
  //     { text: "Không", style: "cancel" },
  //     {
  //       text: "Có",
  //       style: "destructive",
  //       onPress: () => {
  //         // Gọi API hủy đặt sân
  //         Alert.alert("Thành công", "Đã hủy đặt sân", [
  //           {
  //             text: "OK",
  //             onPress: () => {
  //               // Cập nhật trạng thái booking
  //               if (booking) {
  //                 setBooking({ ...booking, status: "CANCELLED" });
  //               }
  //             },
  //           },
  //         ]);
  //       },
  //     },
  //   ]);
  // };

  const handleVnpay = async () => {
    const paymentRequest = {
      userId: booking.userId,
      amount: booking.depositAmount,
      bookingCode: booking.bookingCode,
      type: "BOOKING",
      status: "PENDING",
      paymentMethod: "VNPAY",
      referenceId: booking.id,
    };
    console.log("Payment Request:", paymentRequest);
    try {
      const payment = await dispatch(
        createVnPayPayment(paymentRequest)
      ).unwrap();
      if (payment && payment.paymentUrl) {
        navigation.navigate("VnpayScreen", { paymentUrl: payment.paymentUrl });
      } else {
        Alert.alert(
          "Lỗi thanh toán",
          "Không lấy được đường dẫn thanh toán VNPAY."
        );
      }
    } catch (error) {
      Alert.alert(
        "Lỗi thanh toán",
        "Không thể tạo thanh toán VNPAY. Vui lòng thử lại."
      );
    }
  };

  const handleContact = () => {
    Alert.alert("Liên hệ hỗ trợ", "Gọi 1900 1234 để được hỗ trợ", [
      { text: "Hủy", style: "cancel" },
      { text: "Gọi ngay", onPress: () => console.log("Gọi số hỗ trợ") },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Chi Tiết Đặt Sân</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(booking?.status || "") },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(booking?.status || "")}
            </Text>
          </View>
          <Text style={styles.bookingCode}>
            Mã đặt sân: {booking?.bookingCode}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin sân golf</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="golf-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Tên sân:</Text>
              <Text style={styles.infoValue}>{booking?.golfCourse.name}</Text>
            </View>
            {booking?.golfCourse.location && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#2E7D32" />
                <Text style={styles.infoLabel}>Địa điểm:</Text>
                <Text style={styles.infoValue}>
                  {booking.golfCourse.location}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết đặt sân</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Ngày chơi:</Text>
              <Text style={styles.infoValue}>
                {formatDate(booking?.bookingDate)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Giờ chơi:</Text>
              <Text style={styles.infoValue}>{booking?.teeTime.startTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="golf" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Số hố:</Text>
              <Text style={styles.infoValue}>{booking?.numberOfHoles} hố</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Số người:</Text>
              <Text style={styles.infoValue}>{booking?.numPlayers}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Tên khách:</Text>
              <Text style={styles.infoValue}>{booking?.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>{booking?.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{booking?.email || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="create-outline" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Ngày đặt:</Text>
              <Text style={styles.infoValue}>
                {formatDateTime(booking?.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {(booking?.checkInTime || booking?.checkOutTime) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thời gian nhận/trả sân</Text>
            <View style={styles.infoCard}>
              {booking?.checkInTime && (
                <View style={styles.infoRow}>
                  <Ionicons name="log-in-outline" size={20} color="#2E7D32" />
                  <Text style={styles.infoLabel}>Nhận sân:</Text>
                  <Text style={styles.infoValue}>
                    {formatDateTime(booking.checkInTime)}
                  </Text>
                </View>
              )}
              {booking?.checkInBy && (
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={20} color="#2E7D32" />
                  <Text style={styles.infoLabel}>Nhân viên:</Text>
                  <Text style={styles.infoValue}>{booking.checkInBy}</Text>
                </View>
              )}
              {booking?.checkOutTime && (
                <View style={styles.infoRow}>
                  <Ionicons name="log-out-outline" size={20} color="#2E7D32" />
                  <Text style={styles.infoLabel}>Trả sân:</Text>
                  <Text style={styles.infoValue}>
                    {formatDateTime(booking.checkOutTime)}
                  </Text>
                </View>
              )}
              {booking?.checkOutBy && (
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={20} color="#2E7D32" />
                  <Text style={styles.infoLabel}>Nhân viên:</Text>
                  <Text style={styles.infoValue}>{booking.checkOutBy}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {booking?.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{booking.note}</Text>
            </View>
          </View>
        )}

        {bookingDetail.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dịch vụ đã đặt</Text>
            <View style={styles.servicesCard}>
              {bookingDetail.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.serviceItem,
                    index < bookingDetail.length - 1 &&
                      styles.serviceItemBorder,
                  ]}
                >
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceName}>{item.service.name}</Text>
                    <Text style={styles.serviceQuantity}>x{item.quantity}</Text>
                  </View>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.servicePrice}>
                      {formatPrice(
                        item.service.type === "GOLF_CLUB" && item.tool
                          ? item.tool.rentPrice
                          : item.service.price
                      )}
                    </Text>
                    <Text style={styles.serviceTotalPrice}>
                      {formatPrice(item.totalPrice)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>
                Phí sân golf ({booking?.numPlayers} người):
              </Text>
              <Text style={styles.paymentValue}>
                {formatPrice(booking?.priceByCourse)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Phí dịch vụ:</Text>
              <Text style={styles.paymentValue}>
                {formatPrice(booking?.priceByService)}
              </Text>
            </View>

            {(booking?.discountPromotion || 0) > 0 && (
              <View style={styles.discountRow}>
                <Text style={styles.discountLabel}>Giảm giá khuyến mãi:</Text>
                <Text style={styles.discountValue}>
                  -{booking?.discountPromotion}%
                </Text>
              </View>
            )}

            {(booking?.discountMembership || 0) > 0 && (
              <View style={styles.discountRow}>
                <Text style={styles.discountLabel}>Giảm giá thành viên:</Text>
                <Text style={styles.discountValue}>
                  -{booking?.discountMembership}%
                </Text>
              </View>
            )}

            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Đặt cọc:</Text>
              <Text style={styles.depositValue}>
                {formatPrice(booking?.depositAmount)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(booking?.totalCost)}
              </Text>
            </View>
          </View>
        </View>
        {booking?.status === "PENDING" && (
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.vnpay}
              onPress={handleVnpay}
            >
              <Text >Thanh toán ngay</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContact}
          >
            <Ionicons name="call-outline" size={20} color="#2E7D32" />
            <Text style={styles.contactButtonText}>Liên hệ hỗ trợ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#2E7D32",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    padding: 5,
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
    color: "white",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  content: {
    padding: 20,
    paddingTop: 10,
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
  servicesCard: {
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
  serviceItem: {
    paddingVertical: 10,
  },
  serviceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  serviceQuantity: {
    fontSize: 14,
    color: "#666",
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  servicePrice: {
    fontSize: 14,
    color: "#666",
  },
  serviceTotalPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2E7D32",
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
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "#FFF8E1",
    padding: 8,
    borderRadius: 8,
  },
  discountLabel: {
    fontSize: 14,
    color: "#FF8F00",
  },
  discountValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF8F00",
  },
  depositValue: {
    fontSize: 14,
    color: "#FF9800",
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
  paymentMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  paymentMethodText: {
    marginLeft: 10,
    color: "#1976D2",
    fontSize: 14,
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

  vnpay: {
    // backgroundColor: "blue",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: "Red",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  contactButtonText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
