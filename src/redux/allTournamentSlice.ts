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

// fetch all selected students lichess tournaments
export const fetchAllSelectedStudentsLichessTournaments = createAsyncThunk(
  "tournaments/fetchAllSelectedStudentsLichessTournaments",
  async (studentId, { rejectWithValue }) => {
    try {
      const { data: resData } = await axios.post(
        "/api/tournaments/lichess/fetchAllSelectedStudentsLichessTournaments",
        { studentId }
      );
      console.log("fetchAllSelectedStudentsLichessTournaments", resData);

      return resData.allSelectedStudentsLichessTournaments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: any = {
  // all lichess tournaments
  allLichessTournamentsList: [],
  allActiveLichessTournamentsList: [],
  allFilteredActiveLichessTournamentsList: [],
  allLichessTournamentsLoading: true,

  // all selected students lichess tournaments
  allSelectedStudentsLichessTournamentsList: [],
  allActiveSelectedStudentsLichessTournamentsList: [],
  allSelectedStudentsLichessTournamentsLoading: true,
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
      })

      // selected students lichess tournaments
      // lichess tournaments
      .addCase(fetchAllSelectedStudentsLichessTournaments.pending, (state) => {
        state.allSelectedStudentsLichessTournamentsLoading = true;
      })
      .addCase(
        fetchAllSelectedStudentsLichessTournaments.fulfilled,
        (state, action) => {
          console.log(
            "after all selected students lichess tournaments",
            action.payload
          );

          state.allSelectedStudentsLichessTournamentsList =
            action.payload?.sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

          // Sorting lichess tournaments by createdAt (latest first)

          const sortedSelectedStudentsLichessTournaments = action.payload
            ?.filter((tournament: any) => tournament?.activeStatus)
            ?.sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

          // Filtering active lichess tournaments after sorting
          state.allActiveSelectedStudentsLichessTournamentsList =
            sortedSelectedStudentsLichessTournaments;

          state.allSelectedStudentsLichessTournamentsLoading = false;
        }
      );
  },
});

export const { filterLichessTournamentList, deleteLichessTournament } =
  allTournamentSlice.actions;
export default allTournamentSlice.reducer;
