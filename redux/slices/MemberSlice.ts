import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// Lấy membership theo userId
export const fetchMembershipByUserId: any = createAsyncThunk(
  "membership/fetchByUserIdAndStatus",
  async ({ param }: any, { rejectWithValue }) => {
    try {
      console.log("Fetching Membership with params:", param);
      const res = await api.get(`/membership/user-status`, {
        params: param,
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Đăng ký membership
export const registerMembership: any = createAsyncThunk(
  "membership/register",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.post(`/membership/register`, data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Hủy membership
export const cancelMembership: any = createAsyncThunk(
  "membership/cancel",
  async (membershipId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/membership/cancel/${membershipId}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// getmembership type
export const getMembershipType: any = createAsyncThunk(
  "membership/getMembershipType",
  async (membershipType: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/membership-type/all`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// getMembership latest
export const getMembershipLatest: any = createAsyncThunk(
  "membership/getMembershipLatest",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/membership/latest/${userId}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

interface MembershipState {
  membershipType: any;
  membershipById: any;
  membershipCurrent: any;
  loading: boolean;
  error: string | null;
  registerSuccess: boolean;
  cancelSuccess: boolean;
}

const initialState: MembershipState = {
  membershipById: null,
  membershipType: null,
  membershipCurrent: null,
  loading: false,
  error: null,
  registerSuccess: false,
  cancelSuccess: false,
};

const memberSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    resetMembershipState: (state) => {
      state.registerSuccess = false;
      state.cancelSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by userId

      .addCase(fetchMembershipByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.membershipById = action.payload;
      })

      .addCase(registerMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.membershipCurrent = action.payload;
      })

      .addCase(getMembershipType.fulfilled, (state, action) => {
        state.loading = false;
        state.membershipType = action.payload;
      })
      .addCase(getMembershipLatest.fulfilled, (state, action) => {
        state.loading = false;
        state.membershipCurrent = action.payload;
      })
      .addCase(cancelMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.membershipCurrent = null;
      });
  },
});

export const { resetMembershipState } = memberSlice.actions;
export default memberSlice.reducer;
