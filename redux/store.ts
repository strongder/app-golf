// store.js
import { configureStore } from "@reduxjs/toolkit";
import golfCourseReducer from "./slices/GolfCourseSlice";
import teeTimeReducer from "./slices/TeeTimeSlice";
import bookingReducer from "./slices/BookingSlice";
import guestReducer from "./slices/GuestSlice";
import serviceReducer from "./slices/ServiceSlice";
import toolReducer from "./slices/ToolSlice";
export const store: any = configureStore({
  reducer: {
    golfCourse: golfCourseReducer,
    teeTime: teeTimeReducer,
    booking: bookingReducer,
    service: serviceReducer,
    guest: guestReducer,
    tool: toolReducer,
  },
});
