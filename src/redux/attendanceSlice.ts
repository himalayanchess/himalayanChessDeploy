import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// get all attendance list
export const getAllAttendanceRecords = createAsyncThunk(
  "attendance/getAllAttendanceRecords",
  async (_, { rejectWithValue }) => {
    try {
      // Use axios to make the get request
      const { data: resData } = await axios.get(
        "/api/attendance/getAllAttendanceRecords"
      );

      return resData.allAttendanceRecords;
    } catch (error: any) {
      // Use rejectWithValue to handle errors
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const attendaceSlice = createSlice({
  name: "attendance",
  initialState: {
    // all attendance records
    allAttedanceRecordsList: [],
    allActiveAttedanceRecordsList: [],
    allAttedanceRecordsListLoading: true,

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
  extraReducers: (builder) => {
    builder
      .addCase(getAllAttendanceRecords.pending, (state) => {
        state.allAttedanceRecordsListLoading = false;
      })
      .addCase(getAllAttendanceRecords.fulfilled, (state, action) => {
        console.log("after all attendance records", action.payload);

        state.allAttedanceRecordsList = action.payload?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sorting Projects by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedAttendanceRecords = action.payload
          ?.filter((attendanceRecord: any) => attendanceRecord.activeStatus)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        state.allActiveAttedanceRecordsList = sortedAttendanceRecords;
        state.allAttedanceRecordsListLoading = false;
      });
  },
});

export const { updateAttendanceChartData, setattendanceUpdatedByData } =
  attendaceSlice.actions;

export default attendaceSlice.reducer;
