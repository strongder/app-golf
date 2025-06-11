// Hàm chuyển đổi type sang text hiển thị
function getCategoryText(type: string): string {
  switch (type) {
    case "OTHER":
      return "Khác";
    case "TOOL":
      return "Dụng cụ";
    case "SINGLE_CLUB":
      return "Gậy lẻ";
    case "CLUB_SET":
      return "Bộ gậy";
    case "CADDIE":
      return "Caddie";
    default:
      return "Dịch vụ";
  }
}
("use client");

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { URL_IMAGE } from "@/api";
import { callHotline } from "@/app/util";

interface Service {
  id: string;
  code: string;
  type?: string; // tool, other
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  status: string;
}

export default function ServiceDetailScreen({ route, navigation }: any) {
  const { service }: { service: Service } = route.params;
  // Xác định nếu là dịch vụ OTHER
  const isOtherType = service.type === "OTHER";

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: URL_IMAGE + service.imageUrl }}
        style={styles.heroImage}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {getCategoryText(service.type || "OTHER")}
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
                {service.price > 0
                  ? `${service.price.toLocaleString("vi-VN")} VNĐ`
                  : "Liên hệ"}
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

        <View style={styles.section}>
          {isOtherType ? (
            <Text
              style={[
                styles.description,
                { color: "#2E7D32", fontWeight: "bold" },
              ]}
            >
              Bạn có thể liên hệ trực tiếp để sử dụng dịch vụ này hoặc hỏi thêm
              thông tin tại quầy lễ tân.
            </Text>
          ) : (
            <Text style={styles.description}>
              Dịch vụ này chỉ có thể được chọn khi đặt sân. Vui lòng quay lại
              màn hình đặt sân để thêm dịch vụ vào đơn đặt chỗ của bạn.
            </Text>
          )}
        </View>

        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={callHotline}
          >
            <Ionicons name="call-outline" size={20} color="#2E7D32" />
            <Text style={styles.contactButtonText}>Liên hệ</Text>
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
});
