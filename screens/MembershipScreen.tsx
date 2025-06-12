import { use, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelMembership,
  fetchMembershipByUserId,
  getMembershipLatest,
  getMembershipType,
  registerMembership,
} from "../redux/slices/MemberSlice";
import { createVnPayPayment } from "@/redux/slices/PaymentSlice";

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  recommended?: boolean;
}

export default function MembershipScreen({ navigation }: any) {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { membershipCurrent, membershipType, loading, error } = useSelector(
    (state: any) => state.membership
  );
  console.log("Membership Type:", membershipCurrent);
  useEffect(() => {
    dispatch(getMembershipType());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getMembershipLatest(user.id));
    }
  }, [dispatch, user]);

  const handleVnpay = async () => {
    console.log(membershipCurrent);
    const paymentRequest = {
      userId: user.id,
      amount: membershipCurrent.price,
      type: "MEMBERSHIP",
      status: "PENDING",
      paymentMethod: "VNPAY",
      referenceId: membershipCurrent.id,
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

  const handleRegisterMembership = async () => {
    if (!selectedPlan) {
      Alert.alert(
        "Chọn gói hội viên",
        "Vui lòng chọn một gói hội viên để đăng ký."
      );
      return;
    }

    const data = {
      userId: user.id,
      membershipTypeId: selectedPlan,
    };
    console.log(data);
    // Nếu đang còn hạn hoặc đang chờ duyệt, yêu cầu hủy trước khi đăng ký mới
    if (
      membershipCurrent &&
      (membershipCurrent.status === "ACTIVE" ||
        membershipCurrent.status === "PENDING")
    ) {
      Alert.alert(
        "Đổi gói hội viên",
        "Bạn đang có hội viên còn hạn hoặc đang chờ duyệt. Vui lòng hủy gói hiện tại trước khi đăng ký gói mới.",
        [
          { text: "Đóng", style: "cancel" },
          {
            text: "Hủy gói hiện tại",
            style: "destructive",
            onPress: async () => {
              await dispatch(cancelMembership(membershipCurrent.id));
              Alert.alert(
                "Đã hủy thành công",
                "Bạn có thể đăng ký gói hội viên mới ngay bây giờ."
              );
            },
          },
        ]
      );
      return;
    }
    dispatch(registerMembership(data));
    Alert.alert(
      "Thông báo",
      "Nhân viên sẽ liên hệ với bạn trong vòng 24 giờ để hoàn tất thủ tục. Hoặc bạn có thể thanh toán để được duyệt sớm nhất."
    );
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ duyệt";
      case "ACTIVE":
        return "Đang hoạt động";
      case "EXPIRED":
        return "Hết hạn";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không rõ";
    }
  };

  const onCancelMembership = () => {
    if (membershipCurrent) {
      Alert.alert(
        "Hủy hội viên",
        "Bạn có chắc chắn muốn hủy gói hội viên hiện tại không?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xác nhận",
            style: "destructive",
            onPress: () => {
              dispatch(cancelMembership(membershipCurrent.id));
              Alert.alert("Thành công", "Đã hủy gói hội viên!");
            },
          },
        ]
      );
    } else {
      Alert.alert("Thông báo", "Bạn không có gói hội viên nào để hủy.");
    }
  };

  // Convert API response to MembershipPlan[]
  const membershipPlans: MembershipPlan[] = Array.isArray(membershipType)
    ? membershipType.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        duration: `${plan.duration} tháng`,
        features: plan.benefits || [],
        recommended: plan.discount && plan.discount > 0,
      }))
    : [];
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đăng ký hội viên </Text>
        </View>
        <View style={styles.content}>
          {membershipCurrent ? (
            <View style={styles.bannerContainer}>
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>
                  Hội viên hiện tại: {membershipCurrent?.membershipTypeName}
                </Text>
                {/* <Text style={styles.bannerSubtitle}>Bạn đang là hội viên</Text> */}
                <Text style={styles.textLine}>
                  Mã hội viên: {membershipCurrent?.code}
                </Text>
                <Text style={styles.textLine}>
                  Ngày đăng ký:{" "}
                  {new Date(membershipCurrent.endDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </Text>
                <Text style={styles.textLine}>
                  Ngày hết hạn:{" "}
                  {new Date(membershipCurrent.endDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </Text>
                {membershipCurrent?.status && (
                  <Text style={styles.statusText}>
                    Trạng thái: {getStatusText(membershipCurrent.status)}
                  </Text>
                )}
              </View>
              {/* Nút Hủy & Thanh toán */}
              <View style={styles.buttonContainer}>
                {membershipCurrent.status !== "CANCELLED" && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancelMembership}
                  >
                    <Text style={styles.buttonText}>Hủy</Text>
                  </TouchableOpacity>
                )}

                {membershipCurrent.status === "PENDING" && (
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={handleVnpay}
                  >
                    <Text style={styles.buttonText}>Thanh toán</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.bannerContainer}>
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>Trở thành hội viên</Text>
                <Text style={styles.bannerSubtitle}>
                  Tận hưởng đặc quyền và ưu đãi độc quyền
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.sectionTitle}>Chọn gói hội viên</Text>

          {membershipPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
                plan.recommended && styles.recommendedPlan,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </View>
                {selectedPlan === plan.id && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </View>

              <Text style={styles.planPrice}>
                {plan.price.toLocaleString("vi-VN")} VNĐ
              </Text>

              <View style={styles.featuresContainer}>
                {Array.isArray(plan.features)
                  ? plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#2E7D32"
                        />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))
                  : null}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegisterMembership}
            disabled={loading || !selectedPlan}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "Đang xử lý..." : "Đăng ký hội viên"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Bằng cách đăng ký, bạn đồng ý với các điều khoản và điều kiện của
            chúng tôi. Nhân viên sẽ liên hệ với bạn trong vòng 24 giờ để hoàn
            tất thủ tục đăng ký.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  content: {
    padding: 20,
  },
  bannerContainer: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerOverlay: {
    flexDirection: "column",
  },
  bannerTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  membershipName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 6,
  },
  textLine: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  bannerImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  planCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPlan: {
    borderColor: "#2E7D32",
  },
  recommendedPlan: {
    borderColor: "#FFD700",
  },
  recommendedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  recommendedText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 12,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 10,
  },
  payButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  planDuration: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  registerButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disclaimer: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
});
