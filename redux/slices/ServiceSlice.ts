
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api";

// Async thunk to fetch all services
export const fetchAllServices = createAsyncThunk(
  "service/fetchAllServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/services/all");
      // Assuming response.data.data is the array of services
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    serviceByBooking: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceByBooking = action.payload;
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload as string;
      });
  },
});

export default serviceSlice.reducer;
