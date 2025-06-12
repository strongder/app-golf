interface BookingState {
  createdBooking: any;
  searchBookingResult: any;
  eventForBooking: any;
  updatedBooking: any;
}

// BookingDetailRequest type
export interface BookingDetailRequest {
  id?: string;
  serviceId?: string;
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
export const searchBooking: any = createAsyncThunk(
  "booking/searchBooking",
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/booking/search", request);
      return response.data.data.data;
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
      console.log("Adding Booking Details:", bookingId, details);
      const response = await api.post(`/booking-detail/booking/${bookingId}`, details);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState: BookingState = {
  createdBooking: null,
  searchBookingResult: null,
  eventForBooking: null,
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
        state.searchBookingResult = action.payload;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.updatedBooking = action.payload;
      })
      .addCase(addBookingDetailToBooking.fulfilled, (state, action) => {
        
      });
  },
});

export default bookingSlice.reducer;
