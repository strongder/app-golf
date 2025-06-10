import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

// Lấy tee time khả dụng theo sân và ngày
export const getAvailableTeeTimes: any = createAsyncThunk(
  "teeTime/getAvailableTeeTimes",
  async (
    { golfCourseId, date }: { golfCourseId: string; date: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/tee-time/available", {
        params: { golfCourseId, date },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Lấy tee time theo sân, ngày, phân trang
export const getTeeTimeByDateAndGolfCourseId: any = createAsyncThunk(
  "teeTime/getTeeTimeByDateAndGolfCourseId",
  async (
    {
      golfCourseId,
      date,
      page = 0,
      size = 20,
    }: { golfCourseId?: string; date?: string; page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/tee-time/by-date-and-golf-course", {
        params: { golfCourseId, date, page, size },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Hold tee time
export const holdTeeTime: any = createAsyncThunk(
  "teeTime/holdTeeTime",
  async (
    { teeTimeId, holes }: { teeTimeId: string; holes: number },
    { rejectWithValue }
  ) => {
    try {
      console.log("Holding Tee Time:", teeTimeId, holes);
      const response = await api.get("/tee-time/hold", {
        params: { teeTimeId, holes },
      });
      console.log("Hold Tee Time Response:", response.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface TeeTimeState {
  availableTeeTimes: any[];
  teeTimesByDateAndCourse: any[];
  holdResult: any;
  loading: boolean;
  error: string | null;
}

const initialState: TeeTimeState = {
  availableTeeTimes: [],
  teeTimesByDateAndCourse: [],
  holdResult: null,
  loading: false,
  error: null,
};

const teeTimeSlice = createSlice({
  name: "teeTime",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAvailableTeeTimes
      .addCase(getAvailableTeeTimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableTeeTimes.fulfilled, (state, action) => {
        state.loading = false;
        state.availableTeeTimes = action.payload;
      })
      .addCase(getAvailableTeeTimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getTeeTimeByDateAndGolfCourseId
      .addCase(getTeeTimeByDateAndGolfCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeeTimeByDateAndGolfCourseId.fulfilled, (state, action) => {
        state.loading = false;
        state.teeTimesByDateAndCourse = action.payload;
      })
      .addCase(getTeeTimeByDateAndGolfCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // holdTeeTime
      .addCase(holdTeeTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(holdTeeTime.fulfilled, (state, action) => {
        state.loading = false;
        state.holdResult = action.payload;
      })
      .addCase(holdTeeTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teeTimeSlice.reducer;
