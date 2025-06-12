"use client";

import { useState, useEffect, use } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationsByUser, markNotificationAsRead, markAllAsRead } from "@/redux/slices/NotificationSlice";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  title: string; // Tiêu đề thông báo
  content: string; // Nội dung thông báo
  type: "BOOKING" | "PAYMENT" | "MAINTENANCE" | "PROMOTION";
  read: boolean;
  userId?: string;
  dataId?: string;
  createdAt: string;
}

export default function NotificationsScreen({ navigation }: any) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(
    (state: any) => state.notification
  );

  // Đếm số lượng chưa đọc trực tiếp từ notifications

  useEffect(() => {
    if (user) {
      dispatch(fetchNotificationsByUser());
    }
  }, [dispatch]);

  const markAsRead = (id: string) => {
    dispatch<any>(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch<any>(markAllAsRead(user.id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING":
        return <Ionicons name="golf-outline" size={24} color="#4CAF50" />;
      case "PAYMENT":
        return <Ionicons name="card-outline" size={24} color="#1976d2" />;
      case "MAINTENANCE":
        return <Ionicons name="build-outline" size={24} color="#FF9800" />;
      case "PROMOTION":
        return <Ionicons name="pricetags-outline" size={24} color="#F44336" />;
      default:
        return (
          <Ionicons name="notifications-outline" size={24} color="#2196F3" />
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hôm nay";
    } else if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.iconContainer}>{getNotificationIcon(item.type)}</View>
      <View style={styles.contentContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.content}</Text>
        <Text style={styles.notificationTime}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter((notification:any) => !notification.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Đánh dấu đã đọc tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Không có thông báo nào</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch<any>(fetchNotificationsByUser())} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  markAllButton: {
    padding: 5,
  },
  markAllText: {
    color: "#2E7D32",
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
  },
  notificationItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: "#f0f7f0",
  },
  iconContainer: {
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2E7D32",
    alignSelf: "flex-start",
    marginTop: 5,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});
