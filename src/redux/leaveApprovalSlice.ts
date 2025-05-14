import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch assigned classes
export const fetchAllLeaveRequests = createAsyncThunk(
  "leaverequest/fetchAllLeaveRequests",
  async (_, { rejectWithValue }) => {
    try {
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

const initialState: any = {
  allLeaveRequests: [],
  allFilteredLeaveRequests: [],
  allLeaveRequestsLoading: true,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const leaveApprovalSlice = createSlice({
  name: "leaveApproval",
  initialState,
  reducers: {
    // update state after approving or rejecting
    updateApprovedLeaveRequest: (state, action) => {
      const leaveRecordId = action.payload._id;
      state.allLeaveRequests = state.allLeaveRequests.map(
        (assignedClass: any) => {
          if (assignedClass?._id != leaveRecordId) {
            return assignedClass;
          } else {
            return action.payload;
          }
        }
      );
    },
    // fileter all leave request based on mode and trainer
    filterLeaveRequests: (state, action) => {
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
          .filter((request: any) => request.activeStatus === true) // Keep only active requests
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ); // Sort by latest
        state.allLeaveRequests = tempAllLeaveRequests;
        state.allFilteredLeaveRequests = tempAllLeaveRequests;
        state.allLeaveRequestsLoading = false;
      });
  },
});

export const { updateApprovedLeaveRequest, filterLeaveRequests } =
  leaveApprovalSlice.actions;

export default leaveApprovalSlice.reducer;
