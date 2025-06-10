import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

// get All golf courses
export const getAllGolfCourses: any = createAsyncThunk(
  "golfCourse/getAllGolfCourses",
  async (_, { rejectWithValue }) => {
    try {
    
      const response = await api.get("/golf-course/all");
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching golf courses:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
//get golf course by id
export const getGolfCourseById: any = createAsyncThunk(
  "golfCourse/getGolfCourseById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/golf-course/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching golf course by ID:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
// Slice
const golfCourseSlice = createSlice({
  name: "golfCourse",
  initialState: {
    golfCourses: [],
    loading: false,
    golfCourseById: null,
    bonusAll: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllGolfCourses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllGolfCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.golfCourses = action.payload;
    });
    builder.addCase(getGolfCourseById.fulfilled, (state, action) => {
      state.loading = false;
      state.golfCourseById = action.payload;
    });
  },
});

export default golfCourseSlice.reducer;
