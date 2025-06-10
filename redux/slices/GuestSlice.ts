import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api";

// Lấy thông tin guest theo userId
export const fetchGuestByUserId: any = createAsyncThunk(
  "guest/fetchGuestByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/guest/get-by-user/${userId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cập nhật thông tin guest
export const updateGuest: any = createAsyncThunk(
  "guest/updateGuest",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/guest/update/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const guestSlice = createSlice({
  name: "guest",
  initialState: {
    guestCurrent: null,
    loading: false,
    error: null,
    updateSuccess: false,
  },
  reducers: {
    resetUpdateSuccess(state) {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuestByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuestByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.guestCurrent = action.payload;
      })
      .addCase(fetchGuestByUserId.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateGuest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.guestCurrent = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateGuest.rejected, (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
      });
  },
});

export const { resetUpdateSuccess } = guestSlice.actions;
export default guestSlice.reducer;
