import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// Lấy danh sách thông báo theo user
export const fetchNotificationsByUser: any = createAsyncThunk(
  "notification/fetchByUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching Notifications for User");
      const response = await api.get("/notifications/user");
      console.log("Fetch Notifications Response:", response.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Đánh dấu đã đọc 1 thông báo
export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      console.log("Marking Notification as Read:", notificationId);
      await api.put(`/notifications/mark-as-read/${notificationId}`);
      return { notificationId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Đánh dấu đã đọc tất cả thông báo của user
export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.put(`/notifications/mark-all-as-read/${userId}`);
      return { userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//getUnreadCount
export const getUnreadCount: any = createAsyncThunk(
  "notification/getUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/unread-count");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    pushNotification: (state: any, action: any) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1; // Tăng số lượng thông báo chưa đọc
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationsByUser.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        // Đánh dấu đã đọc 1 thông báo trong state
        const { notificationId } = action.payload;
        const noti: any = state.notifications.find(
          (n: any) => n.id === notificationId
        );
        if (noti) noti.read = true;
        // Giảm số lượng thông báo chưa đọc
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        // Cập nhật số lượng thông báo chưa đọc từ API
        state.unreadCount = action.payload;
      })
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        // Đánh dấu đã đọc tất cả thông báo trong state
        state.notifications.forEach((n: any) => {
          n.read = true;
        });
        state.unreadCount = 0; // Reset số lượng thông báo chưa đọc
      });
  },
});

export const { pushNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
