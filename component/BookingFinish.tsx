import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { createVnPayPayment } from "@/redux/slices/PaymentSlice";
import { useNavigation } from "@react-navigation/native";

type BookingFinishProps = {
  visible: boolean;
  onClose: () => void;
  bookingInfo: any;
  onPay: () => void;
  onViewHistory: () => void;
};

export const BookingFinish: React.FC<BookingFinishProps> = ({
  visible,
  onClose,
  bookingInfo,
  onPay,
  onViewHistory,
}) => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const handleVnpay = async () => {
    const paymentRequest = {
      userId: bookingInfo.userId,
      device: "MOBILE",
      amount: bookingInfo.depositAmount,
      bookingCode: bookingInfo.bookingCode,
      type: "BOOKING",
      status: "PENDING",
      paymentMethod: "VNPAY",
      referenceId: bookingInfo.id,
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 28,
            width: 320,
            alignItems: "center",
          }}
        >
          <Ionicons
            name="checkmark-circle"
            size={64}
            color="#2E7D32"
            style={{ marginBottom: 12 }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#2E7D32",
              marginBottom: 8,
            }}
          >
            Đã gửi yêu cầu!
          </Text>

          <Text style={styles.modalPaymentMessage}>
            Yêu cầu thanh toán để hoàn thiện việc đặt sân
          </Text>
          {bookingInfo && (
            <>
              <Text style={{ fontSize: 16, marginBottom: 4 }}>
                Sân:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {bookingInfo?.golfCourse?.name}
                </Text>
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 4 }}>
                Ngày:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {bookingInfo.bookingDate}
                </Text>
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 4 }}>
                Giờ:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {bookingInfo.teeTime.startTime}
                </Text>
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 4 }}>
                Mã đặt sân:{" "}
                <Text style={{ fontWeight: "bold", color: "#1976d2" }}>
                  {bookingInfo.bookingCode}
                </Text>
              </Text>
              {/* Thông báo thanh toán trước */}
              <Text
                style={{
                  color: "#1976d2",
                  fontWeight: "bold",
                  fontSize: 15,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Thanh toán trước:{" "}
                {bookingInfo.depositAmount?.toLocaleString("vi-VN")} VNĐ
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 12 }}>
                Tổng tiền:{" "}
                <Text style={{ fontWeight: "bold", color: "#2E7D32" }}>
                  {bookingInfo.totalCost?.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Text>
            </>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: "#1976d2",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 32,
              marginBottom: 10,
              width: "100%",
            }}
            onPress={handleVnpay}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Thanh toán với VNPAY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 2, padding: 10, width: "100%" }}
            onPress={onViewHistory}
          >
            <Text
              style={{
                color: "#2E7D32",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Xem lịch sử đặt sân
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalPaymentMessage: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 12,
    textAlign: "center" as const,
    backgroundColor: "#fff3e0",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ffd180",
  },
});
