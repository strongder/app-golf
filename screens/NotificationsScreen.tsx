"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  createdAt: string
}

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_BACKEND_URL/api/notifications', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
      // const data = await response.json();
      // setNotifications(data);

      // Mock data for demo
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Đặt sân thành công",
          message: "Bạn đã đặt sân golf Long Thành vào ngày 15/01/2024 lúc 08:00.",
          type: "success",
          isRead: false,
          createdAt: "2024-01-10T10:30:00Z",
        },
        {
          id: "2",
          title: "Ưu đãi đặc biệt",
          message: "Giảm 20% cho các booking vào ngày thứ 3 và thứ 4 hàng tuần trong tháng 1/2024.",
          type: "info",
          isRead: false,
          createdAt: "2024-01-08T14:15:00Z",
        },
        {
          id: "3",
          title: "Nhắc nhở lịch chơi",
          message: "Bạn có lịch chơi golf vào ngày mai (12/01/2024) lúc 14:00 tại sân golf Đại Lải.",
          type: "warning",
          isRead: true,
          createdAt: "2024-01-11T09:20:00Z",
        },
        {
          id: "4",
          title: "Hủy đặt sân",
          message: "Đặt sân của bạn vào ngày 10/01/2024 đã bị hủy theo yêu cầu.",
          type: "error",
          isRead: true,
          createdAt: "2024-01-09T16:45:00Z",
        },
        {
          id: "5",
          title: "Giải đấu sắp diễn ra",
          message: "Giải Golf Mùa Xuân sẽ diễn ra vào ngày 20/01/2024. Đăng ký ngay để tham gia!",
          type: "info",
          isRead: true,
          createdAt: "2024-01-05T11:30:00Z",
        },
      ]
      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // Replace with your actual API endpoint
      // await fetch(`YOUR_BACKEND_URL/api/notifications/${id}/read`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // Replace with your actual API endpoint
      // await fetch('YOUR_BACKEND_URL/api/notifications/read-all', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });

      // Update local state
      setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      case "warning":
        return <Ionicons name="alert-circle" size={24} color="#FF9800" />
      case "error":
        return <Ionicons name="close-circle" size={24} color="#F44336" />
      default:
        return <Ionicons name="information-circle" size={24} color="#2196F3" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Hôm nay"
    } else if (diffDays === 1) {
      return "Hôm qua"
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`
    } else {
      return date.toLocaleDateString("vi-VN")
    }
  }

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.iconContainer}>{getNotificationIcon(item.type)}</View>
      <View style={styles.contentContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{formatDate(item.createdAt)}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
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
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchNotifications} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
})
