"use client"

import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Service {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function ServiceDetailScreen({ route, navigation }: any) {
  const { service }: { service: Service } = route.params
  const [quantity, setQuantity] = useState(1)

  const handleBookService = () => {
    Alert.alert("Đặt dịch vụ", `Bạn muốn đặt dịch vụ ${service.name} với số lượng ${quantity}?`, [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: () => {
          // Handle booking service
          Alert.alert("Thành công", "Đặt dịch vụ thành công! Nhân viên sẽ liên hệ với bạn để xác nhận.")
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: service.image }} style={styles.heroImage} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {
                {
                  equipment: "Thiết bị",
                  staff: "Nhân viên",
                  training: "Đào tạo",
                  facility: "Cơ sở",
                  food: "Ẩm thực",
                  wellness: "Thư giãn",
                }[service.category]
              }
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{service.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="pricetag-outline" size={20} color="#2E7D32" />
              <Text style={styles.detailLabel}>Giá:</Text>
              <Text style={styles.detailValue}>
                {service.price > 0 ? `${service.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#2E7D32" />
              <Text style={styles.detailLabel}>Thời gian:</Text>
              <Text style={styles.detailValue}>Theo yêu cầu</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={20} color="#2E7D32" />
              <Text style={styles.detailLabel}>Địa điểm:</Text>
              <Text style={styles.detailValue}>Tại sân golf</Text>
            </View>
          </View>
        </View>

        {service.price > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đặt dịch vụ</Text>
            <View style={styles.bookingContainer}>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Số lượng:</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Ionicons name="remove" size={20} color="#2E7D32" />
                  </TouchableOpacity>
                  <Text style={styles.quantityValue}>{quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
                    <Ionicons name="add" size={20} color="#2E7D32" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Tổng tiền:</Text>
                <Text style={styles.totalValue}>{(service.price * quantity).toLocaleString("vi-VN")} VNĐ</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call-outline" size={20} color="#2E7D32" />
            <Text style={styles.contactButtonText}>Liên hệ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookButton} onPress={handleBookService}>
            <Text style={styles.bookButtonText}>Đặt dịch vụ</Text>
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
  heroImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  detailsContainer: {
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
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
    width: 80,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  bookingContainer: {
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  quantityLabel: {
    fontSize: 16,
    color: "#666",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: "center",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  ctaContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginRight: 10,
  },
  contactButtonText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  bookButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
