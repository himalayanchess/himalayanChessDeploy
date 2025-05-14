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

    // selectedDatesAttendanceRecords
    selectedDatesAttendanceRecord: null,

    // selected dates students attendance records
    studentsAttendanceSelectedDay: null,
    selectedDatesStudentsAttendanceRecord: null,
    studentAttendanceStatCount: { present: 0, absent: 0, total: 0 },
    studentsattendanceUpdatedByData: null,
  },
  reducers: {
    // attendace chart data
    updateAttendanceChartData: (state, action) => {
      state.attendanceChartData = action.payload;
    },
    // set attendanceUpdatedByData
    setattendanceUpdatedByData: (state, action) => {
      state.attendanceUpdatedByData = action.payload;
    },

    //selectedDatesAttendanceRecord
    setselectedDatesAttendanceRecord: (state, action) => {
      state.selectedDatesAttendanceRecord = action.payload;
    },

    // students attendance
    setstudentsAttendanceSelectedDay: (state, action) => {
      state.studentsAttendanceSelectedDay = action.payload;
    },

    setselectedDatesStudentsAttendanceRecord: (state, action) => {
      // console.log(
      //   "selectedDatesStudentsAttendanceRecord reord in redux ",
      //   action.payload
      // );

      state.selectedDatesStudentsAttendanceRecord = action.payload;
    },
    setstudentAttendanceStatCount: (state, action) => {
      state.studentAttendanceStatCount = action.payload;
    },
    setStudentsAttendanceUpdatedByData: (state, action) => {
      state.studentsattendanceUpdatedByData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAttendanceRecords.pending, (state) => {
        state.allAttedanceRecordsListLoading = false;
      })
      .addCase(getAllAttendanceRecords.fulfilled, (state, action) => {
        state.allAttedanceRecordsList = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sorting Projects by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedAttendanceRecords = action.payload
          ?.filter((attendanceRecord: any) => attendanceRecord.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        state.allActiveAttedanceRecordsList = sortedAttendanceRecords;
        state.allAttedanceRecordsListLoading = false;
      });
  },
});

export const {
  updateAttendanceChartData,
  setattendanceUpdatedByData,
  setselectedDatesAttendanceRecord,
  setstudentsAttendanceSelectedDay,
  setselectedDatesStudentsAttendanceRecord,
  setstudentAttendanceStatCount,
  setStudentsAttendanceUpdatedByData,
} = attendaceSlice.actions;

export default attendaceSlice.reducer;
