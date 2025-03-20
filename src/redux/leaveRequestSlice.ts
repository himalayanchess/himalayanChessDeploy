import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch assigned classes
export const fetchAllTrainersLeaveRequests = createAsyncThunk(
  "leaverequest/fetchAllTrainersLeaveRequests",
  async ({ trainerId }: any, { rejectWithValue }) => {
    try {
      console.log("fetchAllTrainersLeaveRequests thunk");

      const response = await axios.post(
        "/api/leaverequest/getAllTrainersLeaveRequests",
        {
          trainerId,
        }
      );
      // Return the data from the response
      return response.data.allTrainersLeaveRequests;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const leaveRequestSlice = createSlice({
  name: "leaverequest",
  initialState: {
    allTrainersLeaveRequests: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {
    // append new leave request
    addLeaveRequest: (state: any, action: any) => {
      const tempallTrainersLeaveRequests = [
        ...state.allTrainersLeaveRequests,
        action.payload,
      ];
      state.allTrainersLeaveRequests = tempallTrainersLeaveRequests.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    removeLeaveRequest: (state: any, action: any) => {
      const leaveRequestId = action.payload._id;
      state.allTrainersLeaveRequests = state.allTrainersLeaveRequests.filter(
        (leaveRequest) => leaveRequest?._id != leaveRequestId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTrainersLeaveRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllTrainersLeaveRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Filtering active leave requests and sorting by latest createdAt
        let tempallTrainersLeaveRequests = action.payload;
        state.allTrainersLeaveRequests = tempallTrainersLeaveRequests
          ?.filter((leaveRequest) => leaveRequest?.activeStatus)
          ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sorting by latest createdAt
      });
  },
});

export const { addLeaveRequest, removeLeaveRequest } =
  leaveRequestSlice.actions;

export default leaveRequestSlice.reducer;
