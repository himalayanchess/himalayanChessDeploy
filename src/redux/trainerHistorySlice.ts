import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch assigned classes
export const fetchAllTrainersActivityRecords = createAsyncThunk(
  "trainerHistory/fetchAllTrainersActivityRecords",
  async ({ trainerId }: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/trainer/getAllTrainersActivityRecords",
        {
          trainerId,
        }
      );
      // Return the data from the response
      return response.data.allTrainersActivityRecords;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: any = {
  // allTrainersActivityRecords list
  allTrainersActivityRecords: [],
  allActiveTrainersActivityRecords: [],
  // filter only active
  allFilteredActiveTrainersActivityRecords: [],
  allTrainersActivityRecordsLoading: true,

  status: "",
};

const trainersHistorySlice = createSlice({
  name: "trainerHistory",
  initialState,
  reducers: {
    filterAllTrainersActivityRecords: (state, action) => {
      state.allFilteredActiveTrainersActivityRecords = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // all trainers activity records
      .addCase(fetchAllTrainersActivityRecords.pending, (state) => {
        state.allTrainersActivityRecordsLoading = true;
      })
      .addCase(fetchAllTrainersActivityRecords.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Sorting trainers by createdAt (latest first)
        const sortedTrainersActivityRecrds = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        state.allTrainersActivityRecords = sortedTrainersActivityRecrds;

        // Filtering active trainers after sorting
        let tempActiveRecords = sortedTrainersActivityRecrds?.filter(
          (activityRecord: any) => activityRecord.activeStatus
        );
        state.allActiveTrainersActivityRecords = tempActiveRecords;
        state.allFilteredActiveTrainersActivityRecords = tempActiveRecords;
        state.allTrainersActivityRecordsLoading = false;
      })
      .addCase(fetchAllTrainersActivityRecords.rejected, (state, action) => {
        state.status = "failed";
        state.allTrainersActivityRecordsLoading = false;
      });
  },
});

export const { filterAllTrainersActivityRecords } =
  trainersHistorySlice.actions;

export default trainersHistorySlice.reducer;
