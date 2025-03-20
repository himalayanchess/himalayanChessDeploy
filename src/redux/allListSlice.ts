import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to fetch assigned classes
export const fetchAllTrainers = createAsyncThunk(
  "tariners/fetchAllTrainers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/getTrainersList");
      const resData = await response.json();
      // console.log("das fjhakdf hlhsf", resData);

      return resData.trainersList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const allListSlice = createSlice({
  name: "allList",
  initialState: {
    allTrainerList: [],
    allActiveTrainerList: [],
    status: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTrainers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllTrainers.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("after all trainers", action.payload);

        state.allTrainerList = action.payload;
        const tempAllActiveTrainerList = action.payload?.filter(
          (trainer) => trainer.activeStatus
        );
        state.allActiveTrainerList = tempAllActiveTrainerList;
      })
      .addCase(fetchAllTrainers.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const {} = allListSlice.actions;

export default allListSlice.reducer;
