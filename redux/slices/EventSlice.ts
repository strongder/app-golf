import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// Async thunk for searching events
export const searchEvents: any = createAsyncThunk(
  "event/searchEvents",
  async (searchRequest: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/event/search", searchRequest);
      console.log("Search Events Response:", response.data.data.data);
      return response.data.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//lay promotioin cho user khi booking
export const getPromotionByUserId: any = createAsyncThunk(
  "event/getPromotionByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/event/promotion-for-booking/${userId}`);
      console.log("Get Promotion By UserId Response:", response.data.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface EventState {
  events: any[];
  promotionForBooking: null;
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  promotionForBooking: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload || [];
      })
      .addCase(searchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getPromotionByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.promotionForBooking = action.payload || [];
      });
  },
});

export default eventSlice.reducer;
