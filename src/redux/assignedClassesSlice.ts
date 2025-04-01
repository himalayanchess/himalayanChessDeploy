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
      console.log("assignedddddddddddddddddddd", action.payload);

      state.allActiveAssignedClasses.push(action.payload);
    },
    // remove class from active assigned class
    removeActiveAssignedClass: (state, action) => {
      const classId = action.payload._id;
      state.allActiveAssignedClasses = state.allActiveAssignedClasses.filter(
        (assignedClass) => assignedClass?._id !== classId // Ensure proper comparison
      );
    },
    // update class from active assigned class
    updateActiveAssignedClass: (state, action) => {
      const classId = action.payload._id;
      state.allActiveAssignedClasses = state.allActiveAssignedClasses.map(
        (assignedClass) => {
          if (assignedClass?._id != classId) {
            return assignedClass;
          } else {
            return action.payload;
          }
        }
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
        state.allActiveAssignedClasses = action.payload?.filter(
          (assignedClass) => assignedClass?.activeStatus === true
        );
      })
      .addCase(fetchAssignedClasses.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const {
  addActiveAssignedClass,
  removeActiveAssignedClass,
  updateActiveAssignedClass,
} = assignedClassesSlice.actions;

export default assignedClassesSlice.reducer;
