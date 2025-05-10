import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

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

// all other tournaments
export const fetchAllOtherTournaments = createAsyncThunk(
  "tournaments/fetchAllOtherTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/tournaments/othertournaments/getAllOtherTournaments"
      );
      const resData = await response.json();
      // console.log("das fjhakdf hlhsf", resData);

      return resData.allOtherTournaments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// fetch all selected students other tournaments
export const fetchAllSelectedStudentsOtherTournaments = createAsyncThunk(
  "tournaments/fetchAllSelectedStudentsOtherTournaments",
  async (studentId, { rejectWithValue }) => {
    try {
      const { data: resData } = await axios.post(
        "/api/tournaments/othertournaments/fetchAllSelectedStudentsOtherTournaments",
        { studentId }
      );
      console.log("fetchAllSelectedStudentsOtherTournaments", resData);

      return resData.allSelectedStudentsOtherTournaments;
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

  // all other tournaments
  allOtherTournamentsList: [],
  allActiveOtherTournamentsList: [],
  allFilteredActiveOtherTournamentsList: [],
  allOtherTournamentsLoading: true,

  // all selected students other tournaments
  allSelectedStudentsOtherTournamentsList: [],
  allActiveSelectedStudentsOtherTournamentsList: [],
  allSelectedStudentsOtherTournamentsLoading: true,
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

    // update allFilteredActiveOtherTournamentsList state
    filterOtherTournamentList: (state, action) => {
      state.allFilteredActiveOtherTournamentsList = action.payload;
    },
    // delete other tournament
    deleteOtherTournament: (state, action) => {
      const tournamentId = action.payload;

      let tempAllActiveOtherTournamentList =
        state.allActiveOtherTournamentsList?.filter(
          (tournament: any) => tournament?._id != tournamentId
        );
      state.allActiveOtherTournamentsList = tempAllActiveOtherTournamentList;
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
            dayjs.tz(b.date, "Asia/Kathmandu").valueOf() -
            dayjs.tz(a.date, "Asia/Kathmandu").valueOf()
        );

        // Sorting lichess tournaments by createdAt (latest first)

        const sortedLichessTournaments = action.payload
          ?.filter((tournament: any) => tournament?.activeStatus)
          ?.sort(
            (a: any, b: any) =>
              dayjs.tz(b.date, "Asia/Kathmandu").valueOf() -
              dayjs.tz(a.date, "Asia/Kathmandu").valueOf()
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
                dayjs.tz(b.date, "Asia/Kathmandu").valueOf() -
                dayjs.tz(a.date, "Asia/Kathmandu").valueOf()
            );

          // Sorting lichess tournaments by createdAt (latest first)

          const sortedSelectedStudentsLichessTournaments = action.payload
            ?.filter((tournament: any) => tournament?.activeStatus)
            ?.sort(
              (a: any, b: any) =>
                dayjs.tz(b.date, "Asia/Kathmandu").valueOf() -
                dayjs.tz(a.date, "Asia/Kathmandu").valueOf()
            );

          // Filtering active lichess tournaments after sorting
          state.allActiveSelectedStudentsLichessTournamentsList =
            sortedSelectedStudentsLichessTournaments;

          state.allSelectedStudentsLichessTournamentsLoading = false;
        }
      )

      // other tournaments
      .addCase(fetchAllOtherTournaments.pending, (state) => {
        state.allOtherTournamentsLoading = true;
      })
      .addCase(fetchAllOtherTournaments.fulfilled, (state, action) => {
        console.log("after all other tournaments", action.payload);

        state.allOtherTournamentsList = action.payload?.sort(
          (a: any, b: any) =>
            dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
            dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
        );

        // Sorting other tournaments by createdAt (latest first)

        const sortedOtherTournaments = action.payload
          ?.filter((tournament: any) => tournament?.activeStatus)
          ?.sort(
            (a: any, b: any) =>
              dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
              dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
          );

        // Filtering active other tournaments after sorting
        state.allActiveOtherTournamentsList = sortedOtherTournaments;
        state.allFilteredActiveOtherTournamentsList = sortedOtherTournaments;

        state.allOtherTournamentsLoading = false;
      })

      // selected students other tournaments
      // other tournaments
      .addCase(fetchAllSelectedStudentsOtherTournaments.pending, (state) => {
        state.allSelectedStudentsOtherTournamentsLoading = true;
      })
      .addCase(
        fetchAllSelectedStudentsOtherTournaments.fulfilled,
        (state, action) => {
          console.log(
            "after all selected students other tournaments",
            action.payload
          );

          state.allSelectedStudentsOtherTournamentsList = action.payload?.sort(
            (a: any, b: any) =>
              dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
              dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
          );

          // Sorting other tournaments by createdAt (latest first)

          const sortedSelectedStudentsOtherTournaments = action.payload
            ?.filter((tournament: any) => tournament?.activeStatus)
            ?.sort(
              (a: any, b: any) =>
                dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
                dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
            );

          // Filtering active other tournaments after sorting
          state.allActiveSelectedStudentsOtherTournamentsList =
            sortedSelectedStudentsOtherTournaments;

          state.allSelectedStudentsOtherTournamentsLoading = false;
        }
      );
  },
});

export const {
  filterLichessTournamentList,
  deleteLichessTournament,
  filterOtherTournamentList,
  deleteOtherTournament,
} = allTournamentSlice.actions;
export default allTournamentSlice.reducer;
