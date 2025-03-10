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
  name: "assignClass",
  initialState: {
    allAssignedClasses: [],
    allActiveAssignedClasses: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {
    // append new assigned class
    addActiveAssignedClass: (state, action) => {
      state.allActiveAssignedClasses.push(action.payload);
    },
    // remove class from active assigned class
    removeActiveAssignedClass: (state, action) => {
      const classId = action.payload._id; // Destructure classId from payload
      state.allActiveAssignedClasses = state.allActiveAssignedClasses.filter(
        (assignedClass) => assignedClass?._id !== classId // Ensure proper comparison
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedClasses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignedClasses.fulfilled, (state, action) => {
        state.status = "succeeded";
        // set all assigned classes
        state.allAssignedClasses = action.payload;

        // set all (active) assigned classes
        state.allActiveAssignedClasses = action.payload.filter(
          (assignedClass) => assignedClass?.activeStatus === true
        );
      })
      .addCase(fetchAssignedClasses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addActiveAssignedClass, removeActiveAssignedClass } =
  assignedClassesSlice.actions;

export default assignedClassesSlice.reducer;
