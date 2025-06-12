"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../contexts/AuthContext";
import { URL_IMAGE } from "@/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchGuestByUserId, updateGuest } from "@/redux/slices/GuestSlice";

// Giả sử bạn sẽ lấy guest từ redux hoặc context, ví dụ:
// import { useSelector } from 'react-redux';
// const guest = useSelector((state: any) => state.guest.guestCurrent);
// Ở đây demo với guest null

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [guestForm, setGuestForm] = useState({
    id: "",
    fullName: "",
    phone: "",
    address: "",
    gender: "",
    birthDate: "",
    role: "GOlFER",
  });

  const dispath = useDispatch();
  const { guestCurrent } = useSelector((state: any) => state.guest);
  console.log("Guest Current:", guestCurrent);
  useEffect(() => {
    if (user) {
      dispath(fetchGuestByUserId(user.id));
    }
  }, [user, dispath]);
  useEffect(() => {
    if (guestCurrent) {
      setGuestForm({
        id: guestCurrent.id,
        fullName: guestCurrent.fullName,
        phone: guestCurrent.phone,
        address: guestCurrent.address,
        birthDate: guestCurrent.dob,
        gender: guestCurrent.gender,
        role: guestCurrent.role,
      });
    }
  }, [guestCurrent]);

  console.log("Guest Current:", guestForm);

  const handleSaveProfile = async () => {
    try {
      const updatedGuest = {
        ...guestForm,
        id: guestCurrent.id, // Giữ nguyên ID để cập nhật đúng bản ghi
      };

      console.log("Updating guest with data:", guestCurrent.id, updatedGuest);
      dispath(updateGuest({ id: guestCurrent.id, data: updatedGuest }));
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: logout },
    ]);
  };

  const menuItems = [
    {
      icon: "person-outline",
      title: "Thông tin cá nhân",
      onPress: () => setIsEditing(true),
    },
    // thêm phần lịch sử đặt sân
    {
      icon: "time-outline",
      title: "Lịch sử đặt sân",
      onPress: () => navigation.navigate("BookingHistory"),
    },
    {
      icon: "notifications-outline",
      title: "Thông báo",
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      icon: "shield-checkmark-outline",
      title: "Đăng ký hội viên",
      onPress: () => navigation.navigate("Membership"),
    },
    {
      icon: "help-circle-outline",
      title: "Hỗ trợ",
      onPress: () => Alert.alert("Hỗ trợ", "Liên hệ: support@golfbooking.com"),
    },
    {
      icon: "information-circle-outline",
      title: "Về ứng dụng",
      onPress: () => Alert.alert("Golf Booking", "Phiên bản 1.0.0"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cá nhân</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: URL_IMAGE + user?.avatar }} // avatar vẫn lấy từ user
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Họ tên</Text>
              <TextInput
                style={styles.input}
                value={guestForm.fullName}
                onChangeText={(text) =>
                  setGuestForm((prev) => ({ ...prev, fullName: text }))
                }
                placeholder="Nhập họ tên"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={user.email}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={guestForm.phone}
                onChangeText={(text) =>
                  setGuestForm((prev) => ({ ...prev, phone: text }))
                }
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Địa chỉ</Text>
              <TextInput
                style={styles.input}
                value={guestForm.address}
                onChangeText={(text) =>
                  setGuestForm((prev) => ({ ...prev, address: text }))
                }
                placeholder="Nhập địa chỉ"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Giới tính</Text>
              <TextInput
                style={styles.input}
                value={guestForm.gender}
                onChangeText={(text) =>
                  setGuestForm((prev) => ({ ...prev, gender: text }))
                }
                placeholder="Nam/Nữ"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ngày sinh</Text>
              <TextInput
                style={styles.input}
                value={guestForm.birthDate}
                onChangeText={(text) =>
                  setGuestForm((prev) => ({ ...prev, birthDate: text }))
                }
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {guestCurrent?.fullName || user?.name || ""}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        )}
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon as any} size={24} color="#666" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#F44336" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
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
  profileSection: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2E7D32",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: "#666",
  },
  editForm: {
    width: "100%",
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
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuSection: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 40,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#F44336",
    fontWeight: "bold",
  },
});
