import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch assigned classes
export const fetchAllActivityRecords = createAsyncThunk(
  "activityrecords/fetchAllActivityRecords",
  async (_, { rejectWithValue }) => {
    try {
      console.log("thunkkkkkkkkkk all activity records");

      const { data: resData } = await axios.get(
        "/api/activityrecord/getAllActivityRecords"
      );
      return resData.allActivityRecords;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// fetch all students activity records
export const fetchAllStudentsActivityRecords = createAsyncThunk(
  "activityrecords/fetchAllStudentsActivityRecords",
  async (studentId: any, { rejectWithValue }) => {
    try {
      console.log("thunkkkkkkkkkk student id", studentId);

      const { data: resData } = await axios.post(
        "/api/activityrecord/getAllStudentsActivityRecords",
        { studentId }
      );
      // console.log("getAllStudentsActivityRecords", resData);

      return resData.allStudentsActivityRecords;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const activityRecordSlice = createSlice({
  name: "activityrecord",
  initialState: {
    allActivityRecords: [],
    allActiveActivityRecords: [],
    allFilteredActiveActivityRecords: [],
    allActivityRecordsLoading: true,
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,

    // students activity records
    allStudentsActivityRecords: [],
    allActiveStudentsActivityRecords: [],
    allStudentsActivityRecordsLoading: true,
  },
  reducers: {
    filterActivityRecords: (state, action) => {
      state.allFilteredActiveActivityRecords = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // all activity records
      .addCase(fetchAllActivityRecords.pending, (state) => {
        state.allActivityRecordsLoading = true;
      })
      .addCase(fetchAllActivityRecords.fulfilled, (state, action) => {
        state.status = "succeeded";
        // set all assigned classes
        state.allActivityRecords = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const sortedActivityRecords = action.payload
          ?.filter((activityRecord: any) => activityRecord.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        state.allActiveActivityRecords = sortedActivityRecords;
        state.allFilteredActiveActivityRecords = sortedActivityRecords;
        state.allActivityRecordsLoading = false;
      })
      .addCase(fetchAllActivityRecords.rejected, (state, action) => {
        state.status = "failed";
        state.allActivityRecordsLoading = false;
      })

      // students activity records
      .addCase(fetchAllStudentsActivityRecords.pending, (state) => {
        state.allStudentsActivityRecordsLoading = true;
      })
      .addCase(fetchAllStudentsActivityRecords.fulfilled, (state, action) => {
        state.status = "succeeded";
        // set all assigned classes
        state.allStudentsActivityRecords = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const sortedStudentsActivityRecords = action.payload
          ?.filter((activityRecord: any) => activityRecord.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        state.allActiveStudentsActivityRecords = sortedStudentsActivityRecords;
        state.allStudentsActivityRecordsLoading = false;
      })
      .addCase(fetchAllStudentsActivityRecords.rejected, (state, action) => {
        state.status = "failed";
        state.allStudentsActivityRecordsLoading = false;
      });
  },
});

export const { filterActivityRecords } = activityRecordSlice.actions;

export default activityRecordSlice.reducer;
