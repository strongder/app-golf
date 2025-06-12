import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/api';

// Thunk gọi API tạo thanh toán VNPAY
export const createVnPayPayment: any = createAsyncThunk(
  'payment/createVnPayPayment',
  async (paymentRequest: any, { rejectWithValue }) => {
    try {
      // Thay đổi URL này cho đúng endpoint backend của bạn]
      console.log('Creating VNPAY payment with request:', paymentRequest);
      const response = await api.post('/payment/vn-pay', paymentRequest);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface PaymentState {
  paymentUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentUrl: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPayment: (state) => {
      state.paymentUrl = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVnPayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentUrl = null;
      })
      .addCase(createVnPayPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Giả sử backend trả về { data: { paymentUrl: '...' } }
        state.paymentUrl = action.payload?.paymentUrl || null;
      })
      .addCase(createVnPayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Thanh toán thất bại';
      });
  },
});

export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
