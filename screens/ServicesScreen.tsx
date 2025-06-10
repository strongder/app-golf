"use client"

import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Service {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function ServicesScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState("all")

  const services: Service[] = [
    {
      id: "1",
      name: "Thuê gậy golf",
      description: "Bộ gậy golf cao cấp đầy đủ cho người chơi",
      price: 500000,
      image: "/placeholder.svg?height=150&width=150",
      category: "equipment",
    },
    {
      id: "2",
      name: "Caddy",
      description: "Caddy chuyên nghiệp hỗ trợ trong suốt quá trình chơi",
      price: 350000,
      image: "/placeholder.svg?height=150&width=150",
      category: "staff",
    },
    {
      id: "3",
      name: "Xe điện",
      description: "Xe điện di chuyển trong sân golf",
      price: 300000,
      image: "/placeholder.svg?height=150&width=150",
      category: "equipment",
    },
    {
      id: "4",
      name: "Huấn luyện cá nhân",
      description: "Buổi học 1-1 với huấn luyện viên chuyên nghiệp",
      price: 800000,
      image: "/placeholder.svg?height=150&width=150",
      category: "training",
    },
    {
      id: "5",
      name: "Phòng tập swing",
      description: "Phòng tập swing hiện đại với công nghệ phân tích",
      price: 200000,
      image: "/placeholder.svg?height=150&width=150",
      category: "facility",
    },
    {
      id: "6",
      name: "Nhà hàng VIP",
      description: "Trải nghiệm ẩm thực cao cấp tại nhà hàng sân golf",
      price: 0,
      image: "/placeholder.svg?height=150&width=150",
      category: "food",
    },
    {
      id: "7",
      name: "Spa & Massage",
      description: "Dịch vụ spa và massage thư giãn sau khi chơi golf",
      price: 450000,
      image: "/placeholder.svg?height=150&width=150",
      category: "wellness",
    },
    {
      id: "8",
      name: "Khóa học nhóm",
      description: "Khóa học golf cơ bản cho nhóm 3-5 người",
      price: 600000,
      image: "/placeholder.svg?height=150&width=150",
      category: "training",
    },
  ]

  const categories = [
    { id: "all", name: "Tất cả", icon: "grid-outline" },
    { id: "equipment", name: "Thiết bị", icon: "golf-outline" },
    { id: "staff", name: "Nhân viên", icon: "people-outline" },
    { id: "training", name: "Đào tạo", icon: "school-outline" },
    { id: "facility", name: "Cơ sở", icon: "business-outline" },
    { id: "food", name: "Ẩm thực", icon: "restaurant-outline" },
    { id: "wellness", name: "Thư giãn", icon: "fitness-outline" },
  ]

  const filteredServices =
    activeCategory === "all" ? services : services.filter((service) => service.category === activeCategory)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dịch vụ</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryItem, activeCategory === category.id && styles.activeCategoryItem]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={20}
                color={activeCategory === category.id ? "white" : "#666"}
              />
              <Text style={[styles.categoryText, activeCategory === category.id && styles.activeCategoryText]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => navigation.navigate("ServiceDetail", { service })}
            >
              <Image source={{ uri: service.image }} style={styles.serviceImage} />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {service.description}
                </Text>
                <Text style={styles.servicePrice}>
                  {service.price > 0 ? `${service.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  categoriesContainer: {
    backgroundColor: "white",
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeCategoryItem: {
    backgroundColor: "#2E7D32",
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  activeCategoryText: {
    color: "white",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "48%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  serviceImage: {
    width: "100%",
    height: 120,
  },
  serviceInfo: {
    padding: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    height: 32,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
  },
})
