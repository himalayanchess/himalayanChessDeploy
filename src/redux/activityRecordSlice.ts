import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch assigned classes
export const fetchAllActivityRecords = createAsyncThunk(
  "activityrecords/fetchAllActivityRecords",
  async (_, { rejectWithValue }) => {
    try {
      console.log("thunkkkkkkkkkk");

      const { data: resData } = await axios.get(
        "/api/activityrecord/getAllActivityRecords"
      );
      return resData.allActivityRecords;
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
  },
  reducers: {
    filterActivityRecords: (state, action) => {
      state.allFilteredActiveActivityRecords = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllActivityRecords.pending, (state) => {
        state.allActivityRecordsLoading = true;
      })
      .addCase(fetchAllActivityRecords.fulfilled, (state, action) => {
        state.status = "succeeded";
        // set all assigned classes
        state.allActivityRecords = action.payload?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // set all (active) assigned classes
        state.allActiveActivityRecords = action.payload?.filter(
          (activityRecord: any) => activityRecord?.activeStatus === true
        );

        const sortedActivityRecords = action.payload
          ?.filter((activityRecord: any) => activityRecord.activeStatus)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        state.allActiveActivityRecords = sortedActivityRecords;
        state.allFilteredActiveActivityRecords = sortedActivityRecords;
        state.allActivityRecordsLoading = false;
      })
      .addCase(fetchAllActivityRecords.rejected, (state, action) => {
        state.status = "failed";
        state.allActivityRecordsLoading = false;
      });
  },
});

export const { filterActivityRecords } = activityRecordSlice.actions;

export default activityRecordSlice.reducer;
