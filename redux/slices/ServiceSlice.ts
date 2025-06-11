import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api";
// Async thunk to fetch services by type
export const fetchServicesByType: any = createAsyncThunk(
  "service/fetchServicesByType",
  async (type: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/services/type?type=${type}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch services NOT of a type
export const fetchServicesTypeNot: any = createAsyncThunk(
  "service/fetchServicesTypeNot",
  async (type: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/services/not-type?type=${type}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch all services
export const fetchAllServices: any = createAsyncThunk(
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
    serviceAll: [],
    serviceByBooking: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceAll = action.payload;
      })
      .addCase(fetchServicesTypeNot.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceByBooking = action.payload;
      });
  },
});

export default serviceSlice.reducer;
