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

const initialState: any = {
  allAssignedClasses: [],
  allAssignedClassesLoading: true,
  allActiveAssignedClasses: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const assignedClassesSlice = createSlice({
  name: "assignClass",
  initialState,
  reducers: {
    // append new assigned class
    addActiveAssignedClass: (state, action) => {
      console.log("assignedddddddddddddddddddd", action.payload);

      state.allActiveAssignedClasses.push(action.payload);
      // Sort by createdAt after adding
      state.allActiveAssignedClasses.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    // remove class from active assigned class
  removeActiveAssignedClass: (state, action) => {
      const classId = action.payload._id;
      state.allActiveAssignedClasses = state.allActiveAssignedClasses
        .filter((assignedClass: any) => assignedClass?._id !== classId)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    updateActiveAssignedClass: (state, action) => {
      const classId = action.payload._id;
      state.allActiveAssignedClasses = state.allActiveAssignedClasses
        .map((assignedClass: any) =>
          assignedClass?._id !== classId ? assignedClass : action.payload
        )
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedClasses.pending, (state) => {
        state.status = "loading";
        state.allAssignedClassesLoading = true;
      })
      .addCase(fetchAssignedClasses.fulfilled, (state, action) => {
        state.status = "succeeded";

        // set all assigned classes
        state.allAssignedClasses = action.payload;

        // filter and sort active assigned classes by createdAt
        state.allActiveAssignedClasses = action.payload
          ?.filter((assignedClass: any) => assignedClass?.activeStatus === true)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        state.allAssignedClassesLoading = false;
      })
      .addCase(fetchAssignedClasses.rejected, (state, action) => {
        state.status = "failed";
        state.allAssignedClassesLoading = false;
      });
  },
});

export const {
  addActiveAssignedClass,
  removeActiveAssignedClass,
  updateActiveAssignedClass,
} = assignedClassesSlice.actions;

export default assignedClassesSlice.reducer;
