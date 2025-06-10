"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllGolfCourses } from "@/redux/slices/GolfCourseSlice";
import { URL_IMAGE } from "@/api";

interface GolfCourse {
  id: string;
  code: string;
  name: string;
  imageUrl: string;
  holes: number;
  duration: number;
  length: number;
  description: string;
  location: string;
  status: string;
}

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { golfCourses, loading } = useSelector(
    (state: any) => state.golfCourse
  );

  useEffect(() => {
    dispatch(getAllGolfCourses());
  }, [dispatch]);

  const filteredCourses = (golfCourses || []).filter(
    (course: GolfCourse) =>
      course?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const renderCourseItem = ({ item }: { item: GolfCourse }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate("CourseDetail", { course: item })}
    >
      <Image
        source={{ uri: URL_IMAGE + item?.imageUrl }}
        style={styles.courseImage}
      />
      <View style={styles.courseInfo}>
        <Text style={styles.courseName}>{item.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.holes}>{item.holes} lỗ</Text>
          <Text style={styles.holes}>⏱ {item.duration} phút</Text>
          <Text style={styles.holes}>📏 {item.length} m</Text>
        </View>
        <Text style={styles.price}>{item.description}</Text>
        <Text style={styles.price}>Trạng thái: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sân Golf</Text>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sân golf..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(getAllGolfCourses())}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
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
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  courseImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  courseInfo: {
    padding: 18,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  location: {
    marginLeft: 6,
    color: "#757575",
    fontSize: 15,
    fontStyle: "italic",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  holes: {
    color: "#388e3c",
    fontSize: 15,
    fontWeight: "500",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2E7D32",
    // marginTop: 4,
    // marginBottom: 2,
  },
});
