import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// all litches tournaments
export const fetchAllLitchesTournaments = createAsyncThunk(
  "tournaments/fetchAllLitchesTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/tournaments/litches/getAllLitchesTournaments"
      );
      const resData = await response.json();
      // console.log("das fjhakdf hlhsf", resData);

      return resData.allLitchesTournaments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: any = {
  allLitchesTournamentsList: [],
  allActiveLitchesTournamentsList: [],
  allFilteredActiveLitchesTournamentsList: [],
  allLitchesTournamentsLoading: true,
};

const allTournamentSlice = createSlice({
  name: "alltournaments",
  initialState,
  reducers: {
    // update allFilteredActiveLitchesTournamentsList state
    filterLitchesTournamentList: (state, action) => {
      state.allFilteredActiveLitchesTournamentsList = action.payload;
    },
    // delete litches tournament
    deleteLitchesTournament: (state, action) => {
      const tournamentId = action.payload;

      let tempAllActiveLitchesTournamentList =
        state.allActiveLitchesTournamentsList?.filter(
          (tournament: any) => tournament?._id != tournamentId
        );
      state.allActiveLitchesTournamentsList =
        tempAllActiveLitchesTournamentList;
    },
  },
  extraReducers: (builder) => {
    builder
      // litches tournaments
      .addCase(fetchAllLitchesTournaments.pending, (state) => {
        state.allLitchesTournamentsLoading = true;
      })
      .addCase(fetchAllLitchesTournaments.fulfilled, (state, action) => {
        console.log("after all litches tournaments", action.payload);

        state.allLitchesTournamentsList = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Sorting litches tournaments by createdAt (latest first)

        const sortedLitchesTournaments = action.payload
          ?.filter((tournament: any) => tournament?.activeStatus)
          ?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Filtering active litches tournaments after sorting
        state.allActiveLitchesTournamentsList = sortedLitchesTournaments;
        state.allFilteredActiveLitchesTournamentsList =
          sortedLitchesTournaments;

        state.allLitchesTournamentsLoading = false;
      });
  },
});

export const { filterLitchesTournamentList, deleteLitchesTournament } =
  allTournamentSlice.actions;
export default allTournamentSlice.reducer;
