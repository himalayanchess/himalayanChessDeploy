import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch assigned classes
export const fetchAllStudentsTestHistory = createAsyncThunk(
  "testhistory/fetchAllStudentsTestHistory",
  async (studentId: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/testhistory/fetchAllStudentsTestHistory",
        {
          studentId,
        }
      );
      // Return the data from the response

      return response.data.allStudentsTestHistory;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: any = {
  allStudentsTestHistory: [],
  allActiveStudentsTestHistory: [],
  allStudentsTestHistoryLoading: true,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const testHistorySlice = createSlice({
  name: "testhistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudentsTestHistory.pending, (state) => {
        state.status = "loading";
        state.allStudentsTestHistoryLoading = true;
      })
      .addCase(fetchAllStudentsTestHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Filtering active leave requests and sorting by latest createdAt
        let tempallStudentsTestHistory = action.payload;

        state.allStudentsTestHistory = tempallStudentsTestHistory?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        state.allActiveStudentsTestHistory = tempallStudentsTestHistory
          ?.filter((testHistory: any) => testHistory?.activeStatus)
          ?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ); // Sorting by latest createdAt
        state.allStudentsTestHistoryLoading = false;
      })
      .addCase(fetchAllStudentsTestHistory.rejected, (state) => {
        state.status = "rejected";
        state.allStudentsTestHistoryLoading = false;
      });
  },
});

export const {} = testHistorySlice.actions;

export default testHistorySlice.reducer;
