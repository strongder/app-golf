"use client"

import { useState } from "react"
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
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../contexts/AuthContext"

interface MembershipPlan {
  id: string
  name: string
  price: number
  duration: string
  features: string[]
  recommended?: boolean
}

export default function MembershipScreen({ navigation }: any) {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const membershipPlans: MembershipPlan[] = [
    {
      id: "basic",
      name: "Hội viên Cơ bản",
      price: 5000000,
      duration: "3 tháng",
      features: ["Ưu đãi 10% giá đặt sân", "Đặt sân ưu tiên", "Tham gia 1 giải đấu"],
    },
    {
      id: "premium",
      name: "Hội viên Premium",
      price: 12000000,
      duration: "6 tháng",
      features: ["Ưu đãi 15% giá đặt sân", "Đặt sân ưu tiên", "Tham gia 3 giải đấu", "Huấn luyện 2 buổi"],
      recommended: true,
    },
    {
      id: "vip",
      name: "Hội viên VIP",
      price: 20000000,
      duration: "12 tháng",
      features: [
        "Ưu đãi 20% giá đặt sân",
        "Đặt sân ưu tiên cao cấp",
        "Tham gia không giới hạn giải đấu",
        "Huấn luyện 5 buổi",
        "Phòng chờ VIP",
        "Caddy ưu tiên",
      ],
    },
  ]

  const handleRegister = async () => {
    if (!selectedPlan) {
      Alert.alert("Thông báo", "Vui lòng chọn gói hội viên")
      return
    }

    setLoading(true)
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_BACKEND_URL/api/membership/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     planId: selectedPlan,
      //     userId: user?.id,
      //   }),
      // });

      // Mock success
      setTimeout(() => {
        Alert.alert(
          "Đăng ký thành công!",
          "Bạn đã đăng ký gói hội viên thành công. Nhân viên sẽ liên hệ với bạn để hoàn tất thủ tục.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
        )
        setLoading(false)
      }, 1500)
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng ký hội viên")
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đăng ký hội viên</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.bannerContainer}>
            <Image source={{ uri: "/placeholder.svg?height=200&width=400" }} style={styles.bannerImage} />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>Trở thành hội viên</Text>
              <Text style={styles.bannerSubtitle}>Tận hưởng đặc quyền và ưu đãi độc quyền</Text>
            </View>
          </View>

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
              {plan.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Phổ biến</Text>
                </View>
              )}
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

              <Text style={styles.planPrice}>{plan.price.toLocaleString("vi-VN")} VNĐ</Text>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Thông tin liên hệ</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Họ tên</Text>
              <TextInput style={styles.input} value={user?.name} editable={false} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={user?.email} editable={false} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput style={styles.input} value={user?.phone || ""} editable={false} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ghi chú (tùy chọn)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading || !selectedPlan}
          >
            <Text style={styles.registerButtonText}>{loading ? "Đang xử lý..." : "Đăng ký hội viên"}</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Bằng cách đăng ký, bạn đồng ý với các điều khoản và điều kiện của chúng tôi. Nhân viên sẽ liên hệ với bạn
            trong vòng 24 giờ để hoàn tất thủ tục đăng ký.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  content: {
    padding: 20,
  },
  bannerContainer: {
    position: "relative",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  bannerSubtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
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
})
