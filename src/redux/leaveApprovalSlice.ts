import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch assigned classes
export const fetchAllLeaveRequests = createAsyncThunk(
  "leaverequest/fetchAllLeaveRequests",
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetchAllLeaveRequests thunk");

      const response = await axios.get(
        "/api/leaveapproval/getAllLeaveRequests"
      );
      // Return the data from the response
      return response.data.allLeaveRequests;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const leaveApprovalSlice = createSlice({
  name: "leaveApproval",
  initialState: {
    allLeaveRequests: [],
    allFilteredLeaveRequests: [],
    allLeaveRequestsLoading: true,
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {
    // update state after approving or rejecting
    updateApprovedLeaveRequest: (state, action) => {
      const leaveRecordId = action.payload._id;
      state.allLeaveRequests = state.allLeaveRequests.map((assignedClass) => {
        if (assignedClass?._id != leaveRecordId) {
          return assignedClass;
        } else {
          return action.payload;
        }
      });
    },
    // fileter all leave request based on mode and trainer
    filterLeaveRequests: (state, action) => {
      // console.log("filterleave requests reuducer ", action.payload);
      state.allFilteredLeaveRequests = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLeaveRequests.pending, (state) => {
        state.status = "loading";
        state.allLeaveRequestsLoading = true;
      })
      .addCase(fetchAllLeaveRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Filtering active leave requests and sorting by latest createdAt
        const tempAllLeaveRequests = action.payload
          .filter((request) => request.activeStatus === true) // Keep only active requests
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by latest
        state.allLeaveRequests = tempAllLeaveRequests;
        state.allFilteredLeaveRequests = tempAllLeaveRequests;
        state.allLeaveRequestsLoading = false;
      });
  },
});

export const { updateApprovedLeaveRequest, filterLeaveRequests } =
  leaveApprovalSlice.actions;

export default leaveApprovalSlice.reducer;
