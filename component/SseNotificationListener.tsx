import { API_URL } from "@/api";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import EventSource from "react-native-sse";

const SseNotificationListener = ({ userId, onNotification }: {
  userId: string;
  onNotification?: (notification: any) => void;
}) => {
  const eventSourceRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;
    const url = `${API_URL}/notifications/subscribe/${userId}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;
    console.log("Connecting to SSE for notifications...", url);


    es.addEventListener("open", () => {
      console.log("Connection to SSE opened.");
    });

    es.addEventListener("message", (event: any) => {
      console.log("Notification received:", event.data);
      try {
        const notification = JSON.parse(event.data);
        if (onNotification) onNotification(notification);
        // Ví dụ: Hiển thị alert (hoặc push vào redux, toast...)
        // Alert.alert("Thông báo mới", notification.title || "Bạn có thông báo mới!");
      } catch (e) {
        console.error("Error parsing notification:", e);
      }
    });

    es.addEventListener("error", (event: any) => {
      console.error("EventSource error:", event);
      // Optional: tự động reconnect nếu muốn
      // Không có readyState/CLOSED, có thể tự reconnect nếu muốn
    });

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        console.log("SSE connection closed.");
      }
    };
  }, [userId]);

  return null;
};

export default SseNotificationListener;
