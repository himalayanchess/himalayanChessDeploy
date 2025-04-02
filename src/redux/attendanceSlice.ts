import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const attendaceSlice = createSlice({
  name: "attendance",
  initialState: {
    // attendanceChartData
    attendanceChartData: [],
    attendanceUpdatedByData: null,
  },
  reducers: {
    // attendace chart data
    updateAttendanceChartData: (state, action) => {
      console.log("char data red", action.payload);

      state.attendanceChartData = action.payload;
    },
    // set attendanceUpdatedByData
    setattendanceUpdatedByData: (state, action) => {
      state.attendanceUpdatedByData = action.payload;
    },
  },
});

export const { updateAttendanceChartData, setattendanceUpdatedByData } =
  attendaceSlice.actions;

export default attendaceSlice.reducer;
