import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch assigned classes
export const fetchTrainersTodayClasses = createAsyncThunk(
  "classes/getTrainersTodaysClasses",
  async ({ trainerId, todaysDate }: any, { rejectWithValue }) => {
    try {
      console.log("teacher slice fetchTrainersTodayClasses slice");

      // Use axios to make the POST request
      const response = await axios.post(
        "/api/classes/getTrainersTodaysClasses",
        {
          trainerId,
          todaysDate,
        }
      );

      // Return the data from the response
      return response.data.trainersTodaysClasses;
    } catch (error: any) {
      // Use rejectWithValue to handle errors
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const trainerSlice = createSlice({
  name: "assignClass",
  initialState: {
    trainersTodaysClasses: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainersTodayClasses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrainersTodayClasses.fulfilled, (state, action) => {
        console.log(
          "thunk fetchtraierclasses fulfilleed with data ",
          action.payload
        );

        state.status = "succeeded";
        // set all assigned classes
        state.trainersTodaysClasses = action.payload;
      })
      .addCase(fetchTrainersTodayClasses.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const {} = trainerSlice.actions;

export default trainerSlice.reducer;
