
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api";

// Async thunk to fetch tools by type
export const fetchToolsByType = createAsyncThunk(
  "tool/fetchToolsByType",
  async (type: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/tools/type/${type}`);
      return response.data.data; // Assuming ApiResponse.success(data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy danh sách dụng cụ");
    }
  }
);

interface Tool {
  id: string;
  name: string;
  type: string;
  status?: string;
  [key: string]: any;
}

interface ToolState {
  toolsByType: { [type: string]: Tool[] };
  loading: boolean;
  error?: string;
}

const initialState: ToolState = {
  toolsByType: {},
  loading: false,
  error: undefined,
};

const toolSlice = createSlice({
  name: "tool",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchToolsByType.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchToolsByType.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg) {
          state.toolsByType[action.meta.arg] = action.payload;
        }
      })
      .addCase(fetchToolsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default toolSlice.reducer;
