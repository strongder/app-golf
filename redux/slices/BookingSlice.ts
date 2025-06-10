interface BookingState {
  createdBooking: any;
  searchResult: any;
  updatedBooking: any;
}

// BookingDetailRequest type
export interface BookingDetailRequest {
  id?: string;
  serviceId?: string;
  toolId?: string;
  quantity: number;
  totalPrice: number;
}
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

// Tạo booking
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/booking/create", request);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Tìm kiếm booking
export const searchBooking = createAsyncThunk(
  "booking/searchBooking",
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/booking/search", request);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cập nhật booking
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async (
    { bookingId, data }: { bookingId: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/booking/${bookingId}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// add BookingDetail to Booking

// Thêm BookingDetail vào Booking
export const addBookingDetailToBooking = createAsyncThunk(
  "booking/addBookingDetailToBooking",
  async (
    {
      bookingId,
      details,
    }: { bookingId: string; details: BookingDetailRequest[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/booking/${bookingId}`, details);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState: BookingState = {
  createdBooking: null,
  searchResult: null,
  updatedBooking: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.fulfilled, (state, action) => {
        state.createdBooking = action.payload;
      })
      .addCase(searchBooking.fulfilled, (state, action) => {
        state.searchResult = action.payload;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.updatedBooking = action.payload;
      })
      .addCase(addBookingDetailToBooking.fulfilled, (state, action) => {
        // Không thay đổi state, chỉ cần biết thành công
      });
  },
});

export default bookingSlice.reducer;
