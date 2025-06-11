"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

import { useEffect } from "react";
import axios, { URL_IMAGE } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllServices } from "@/redux/slices/ServiceSlice";

interface ServicesResponse {
  id: string;
  code: string;
  type: string; // tool, other
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export default function ServicesScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState("all");
  const { serviceAll, loading } = useSelector((state: any) => state.service);

  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  const categories = [
    { id: "all", name: "Tất cả", icon: "grid-outline" },
    { id: "SINGLE_CLUB", name: "Gậy lẻ", icon: "golf-outline" },
    { id: "CLUB_SET", name: "Bộ gậy", icon: "golf-outline" },
    { id: "CADDIE", name: "Caddie", icon: "people-outline" },
    { id: "TOOL", name: "Dụng cụ", icon: "construct-outline" },
    { id: "OTHER", name: "Khác", icon: "ellipsis-horizontal-outline" },
  ];
  // Map type to category for UI filter (the new types)
  const typeToCategory: Record<string, string> = {
    SINGLE_CLUB: "equipment",
    CLUB_SET: "equipment",
    CADDIE: "staff",
    TOOL: "equipment",
    OTHER: "other",
  };

  // Lọc dịch vụ theo type mới
  const filteredServices =
    activeCategory === "all"
      ? serviceAll
      : serviceAll.filter((service: any) => {
          // Ưu tiên map type sang category UI
          const mappedCategory = typeToCategory[service.type];
          return (
            mappedCategory === activeCategory ||
            service.type === activeCategory ||
            service.category === activeCategory
          );
        });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dịch vụ</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                activeCategory === category.id && styles.activeCategoryItem,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={20}
                color={activeCategory === category.id ? "white" : "#666"}
              />
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.activeCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesGrid}>
          {loading ? (
            <Text>Đang tải dịch vụ...</Text>
          ) : filteredServices.length === 0 ? (
            <Text>Không có dịch vụ nào</Text>
          ) : (
            filteredServices.map((service: any) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() =>
                  navigation.navigate("ServiceDetail", { service })
                }
              >
                <Image
                  source={{ uri: URL_IMAGE + service.imageUrl }}
                  style={styles.serviceImage}
                />
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription} numberOfLines={2}>
                    {service.description}
                  </Text>
                  <Text style={styles.servicePrice}>
                    {service.price > 0
                      ? `${service.price.toLocaleString("vi-VN")} VNĐ`
                      : "Liên hệ"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
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
});
