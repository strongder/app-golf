import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { URL_IMAGE } from "@/api"

const { width } = Dimensions.get("window")

export default function CourseDetailScreen({ route, navigation }: any) {
  const { course } = route.params

  const handleBookNow = () => {
    navigation.navigate("Booking", {
      screen: "BookingMain",
      params: { course },
    })
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: URL_IMAGE + course.imageUrl }} style={styles.heroImage} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.courseName}>{course.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.location}>{course.location}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="golf-outline" size={20} color="#2E7D32" />
            <Text style={styles.statText}>{course.holes}</Text>
            <Text style={styles.statLabel}>Lỗ</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={20} color="#2E7D32" />
            <Text style={styles.statText}>{course.duration}</Text>
            <Text style={styles.statLabel}>Phút</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="walk-outline" size={20} color="#2E7D32" />
            <Text style={styles.statText}>{course.length}</Text>
            <Text style={styles.statLabel}>m</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện ích</Text>
          <View style={styles.amenitiesContainer}>
            <View style={styles.amenityItem}>
              <Ionicons name="car-outline" size={24} color="#2E7D32" />
              <Text style={styles.amenityText}>Bãi đỗ xe</Text>
            </View>
            <View style={styles.amenityItem}>
              <Ionicons name="restaurant-outline" size={24} color="#2E7D32" />
              <Text style={styles.amenityText}>Nhà hàng</Text>
            </View>
            <View style={styles.amenityItem}>
              <Ionicons name="storefront-outline" size={24} color="#2E7D32" />
              <Text style={styles.amenityText}>Pro Shop</Text>
            </View>
            <View style={styles.amenityItem}>
              <Ionicons name="fitness-outline" size={24} color="#2E7D32" />
              <Text style={styles.amenityText}>Driving Range</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Mã sân: {course.code}</Text>
          <Text style={styles.priceLabel}>Trạng thái: {course.status}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Đặt sân ngay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  heroImage: {
    width: width,
    height: 250,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  courseName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    marginLeft: 5,
    color: "#666",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
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
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amenityItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  amenityText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  priceSection: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginVertical: 5,
  },
  priceNote: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  bookButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})
