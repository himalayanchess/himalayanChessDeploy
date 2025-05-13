import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

// fetchAllHcaCircuitTournaments
export const fetchAllHcaCircuitTournaments = createAsyncThunk(
  "tournaments/fetchAllHcaCircuitTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const { data: resData } = await axios.get(
        "/api/tournaments/hcacircuit/fetchAllHcaCircuitTournaments"
      );
      //   console.log("fetchAllHcaCircuitTournaments", resData);

      return resData.allHcaCircuitTournaments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// fetchAllMainHcaCircuitSeriesTournaments
export const fetchallmainhcacircuitseriestournaments = createAsyncThunk(
  "tournaments/fetchallmainhcacircuitseriestournaments",
  async (mainHcaCircuitTournamentId, { rejectWithValue }) => {
    try {
      const { data: resData } = await axios.post(
        "/api/tournaments/hcacircuit/hcacircuitseries/fetchallmainhcacircuitseriestournaments",
        {
          mainHcaCircuitTournamentId,
        }
      );
      //   console.log("fetchallmainhcacircuitseriestournaments", resData);

      return resData.allMainHcaCircuitSeriesTournaments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// fetch all selected students HcaCircuitSeries tournaments
export const fetchallselectedstudentshcacircuitseriestournaments =
  createAsyncThunk(
    "tournaments/fetchallselectedstudentshcacircuitseriestournaments",
    async (studentId, { rejectWithValue }) => {
      try {
        const { data: resData } = await axios.post(
          "/api/tournaments/hcacircuit/hcacircuitseries/fetchallselectedstudentshcacircuitseriestournaments",
          { studentId }
        );
        console.log(
          "fetchallselectedstudentshcacircuitseriestournaments",
          resData
        );

        return resData.allSelectedStudentsHcaCircuitSeriesTournaments;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

const initialState: any = {
  // all HcaCircuit tournaments
  allHcaCircuitTournamentsList: [],
  allActiveHcaCircuitTournamentsList: [],
  allFilteredActiveHcaCircuitTournamentsList: [],
  allHcaCircuitTournamentsLoading: true,

  // all Main HcaCircuit Series tournaments
  allMainHcaCircuitSeriesTournamentsList: [],
  allActiveMainHcaCircuitSeriesTournamentsList: [],
  // filtered not used becasuse we show al the series tournaments
  allFilteredActiveMainHcaCircuitSeriesTournamentsList: [],
  allMainHcaCircuitSeriesTournamentsLoading: true,

  // all selected students hca circuit tournaments
  allSelectedStudentsHcaCircuitSeriesTournamentsList: [],
  allActiveSelectedStudentsHcaCircuitSeriesTournamentsList: [],
  allSelectedStudentsHcaCircuitSeriesTournamentsLoading: true,
};

const allHcaCircutTournamentSlice = createSlice({
  name: "allhcacircuittournaments",
  initialState,
  reducers: {
    // update allFilteredActiveHcaCircuitTournamentsList state
    filterHcaCircuitTournamentList: (state, action) => {
      state.allFilteredActiveHcaCircuitTournamentsList = action.payload;
    },
    // delete hca circuit tournament
    deleteHcaCircuitTournament: (state, action) => {
      const tournamentId = action.payload;

      let tempAllActiveHcaCircuitTournamentList =
        state.allActiveHcaCircuitTournamentsList?.filter(
          (tournament: any) => tournament?._id != tournamentId
        );
      state.allActiveHcaCircuitTournamentsList =
        tempAllActiveHcaCircuitTournamentList;
    },

    // main hca circuit series
    // delete main hca circuit series tournament
    deleteMainHcaCircuitSeriesTournament: (state, action) => {
      const tournamentId = action.payload;

      let tempAllMainActiveHcaCircuitSeriesTournamentList =
        state.allActiveMainHcaCircuitSeriesTournamentsList?.filter(
          (tournament: any) => tournament?._id != tournamentId
        );
      state.allActiveMainHcaCircuitSeriesTournamentsList =
        tempAllMainActiveHcaCircuitSeriesTournamentList;
    },
  },
  extraReducers: (builder) => {
    builder
      // hca circuit tournaments
      .addCase(fetchAllHcaCircuitTournaments.pending, (state) => {
        state.allHcaCircuitTournamentsLoading = true;
      })
      .addCase(fetchAllHcaCircuitTournaments.fulfilled, (state, action) => {
        console.log("after all hca circuit tournaments", action.payload);

        state.allHcaCircuitTournamentsList = action.payload?.sort(
          (a: any, b: any) =>
            dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
            dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
        );

        // Sorting hca circuit tournaments by startdate (latest first)

        const sortedHcaCircuitTournaments = action.payload
          ?.filter((tournament: any) => tournament?.activeStatus)
          ?.sort(
            (a: any, b: any) =>
              dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
              dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
          );

        // Filtering hca circuit lichess tournaments after sorting
        state.allActiveHcaCircuitTournamentsList = sortedHcaCircuitTournaments;
        state.allFilteredActiveHcaCircuitTournamentsList =
          sortedHcaCircuitTournaments;

        state.allHcaCircuitTournamentsLoading = false;
      })

      // main hca circuit series tournaments
      .addCase(fetchallmainhcacircuitseriestournaments.pending, (state) => {
        state.allMainHcaCircuitSeriesTournamentsLoading = true;
      })
      .addCase(
        fetchallmainhcacircuitseriestournaments.fulfilled,
        (state, action) => {
          console.log(
            "after all main hca circuit series tournaments",
            action.payload
          );

          state.allMainHcaCircuitSeriesTournamentsList = action.payload?.sort(
            (a: any, b: any) =>
              dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
              dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
          );

          // Sorting hca circuit tournaments by startdate (latest first)

          const sortedMainHcaCircuitSeriesTournaments = action.payload
            ?.filter((tournament: any) => tournament?.activeStatus)
            ?.sort(
              (a: any, b: any) =>
                dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
                dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
            );

          // Filtering hca circuit lichess tournaments after sorting
          state.allActiveMainHcaCircuitSeriesTournamentsList =
            sortedMainHcaCircuitSeriesTournaments;
          state.allFilteredActiveMainHcaCircuitSeriesTournamentsList =
            sortedMainHcaCircuitSeriesTournaments;

          state.allMainHcaCircuitSeriesTournamentsLoading = false;
        }
      )

      // selected students hca circuit series tournaments
      // hca circuit series tournaments
      .addCase(
        fetchallselectedstudentshcacircuitseriestournaments.pending,
        (state) => {
          state.allSelectedStudentsHcaCircuitSeriesTournamentsLoading = true;
        }
      )
      .addCase(
        fetchallselectedstudentshcacircuitseriestournaments.fulfilled,
        (state, action) => {
          console.log(
            "after all selected students hca circuit series tournaments",
            action.payload
          );

          state.allSelectedStudentsHcaCircuitSeriesTournamentsList =
            action.payload?.sort(
              (a: any, b: any) =>
                dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
                dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
            );

          // Sorting hca circuit series tournaments by start date (latest first)

          const sortedSelectedStudentshcaCircuitSeriesTournaments =
            action.payload
              ?.filter((tournament: any) => tournament?.activeStatus)
              ?.sort(
                (a: any, b: any) =>
                  dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
                  dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
              );

          // Filtering active other tournaments after sorting
          state.allActiveSelectedStudentsHcaCircuitSeriesTournamentsList =
            sortedSelectedStudentshcaCircuitSeriesTournaments;

          state.allSelectedStudentsHcaCircuitSeriesTournamentsLoading = false;
        }
      );
  },
});

export const {
  filterHcaCircuitTournamentList,
  deleteHcaCircuitTournament,
  deleteMainHcaCircuitSeriesTournament,
} = allHcaCircutTournamentSlice.actions;

export default allHcaCircutTournamentSlice.reducer;
