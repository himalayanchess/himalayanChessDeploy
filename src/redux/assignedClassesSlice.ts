import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to fetch assigned classes
export const fetchAssignedClasses = createAsyncThunk(
  "classes/getAllAssignedClasses",
  async (_, { rejectWithValue }) => {
    try {
      console.log("thunkkkkkkkkkk");

      const response = await fetch("/api/classes/getAllAssignedClasses");
      const resData = await response.json();
      return resData.allAssignedClasses;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const assignedClassesSlice = createSlice({
  name: "chat-slice",
  initialState: {
    allAssignedClasses: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedClasses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignedClasses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allAssignedClasses = action.payload;
      })
      .addCase(fetchAssignedClasses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {} = assignedClassesSlice.actions;

export default assignedClassesSlice.reducer;
