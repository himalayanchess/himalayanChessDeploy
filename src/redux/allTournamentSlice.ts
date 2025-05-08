import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// all lichess tournaments
export const fetchAllLichessTournaments = createAsyncThunk(
  "tournaments/fetchAllLichessTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/tournaments/lichess/getAllLichessTournaments"
      );
      const resData = await response.json();
      // console.log("das fjhakdf hlhsf", resData);

      return resData.allLichessTournaments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: any = {
  allLichessTournamentsList: [],
  allActiveLichessTournamentsList: [],
  allFilteredActiveLichessTournamentsList: [],
  allLichessTournamentsLoading: true,
};

const allTournamentSlice = createSlice({
  name: "alltournaments",
  initialState,
  reducers: {
    // update allFilteredActiveLichessTournamentsList state
    filterLichessTournamentList: (state, action) => {
      state.allFilteredActiveLichessTournamentsList = action.payload;
    },
    // delete lichess tournament
    deleteLichessTournament: (state, action) => {
      const tournamentId = action.payload;

      let tempAllActiveLichessTournamentList =
        state.allActiveLichessTournamentsList?.filter(
          (tournament: any) => tournament?._id != tournamentId
        );
      state.allActiveLichessTournamentsList =
        tempAllActiveLichessTournamentList;
    },
  },
  extraReducers: (builder) => {
    builder
      // lichess tournaments
      .addCase(fetchAllLichessTournaments.pending, (state) => {
        state.allLichessTournamentsLoading = true;
      })
      .addCase(fetchAllLichessTournaments.fulfilled, (state, action) => {
        console.log("after all lichess tournaments", action.payload);

        state.allLichessTournamentsList = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Sorting lichess tournaments by createdAt (latest first)

        const sortedLichessTournaments = action.payload
          ?.filter((tournament: any) => tournament?.activeStatus)
          ?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Filtering active lichess tournaments after sorting
        state.allActiveLichessTournamentsList = sortedLichessTournaments;
        state.allFilteredActiveLichessTournamentsList =
          sortedLichessTournaments;

        state.allLichessTournamentsLoading = false;
      });
  },
});

export const { filterLichessTournamentList, deleteLichessTournament } =
  allTournamentSlice.actions;
export default allTournamentSlice.reducer;
