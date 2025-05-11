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

// all tournaments organized by hca
export const fetchAllTournamentsOrganizedByHca = createAsyncThunk(
  "tournaments/fetchAllTournamentsOrganizedByHca",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/tournaments/tournamentsorganizedbyhca/fetchAllTournamentsOrganizedByHca"
      );
      const resData = await response.json();
      // console.log("das fjhakdf hlhsf", resData);

      return resData.allTournamentsOrganizedByHca;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// fetch all selected students  tournaments organized by hca
export const fetchAllSelectedStudentsTournamentsOrganizedByHca =
  createAsyncThunk(
    "tournaments/fetchAllSelectedStudentsTournamentsOrganizedByHca",
    async (studentId, { rejectWithValue }) => {
      try {
        const { data: resData } = await axios.post(
          "/api/tournaments/tournamentsorganizedbyhca/fetchAllSelectedStudentsTournamentsOrganizedByHca",
          { studentId }
        );
        console.log(
          "fetchAllSelectedStudentsTournamentsOrganizedByHca",
          resData
        );

        return resData.allSelectedStudentsTournamentsOrganizedByHca;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

// all tournaments hca help in
export const fetchAllTournamentsHcaHelpIn = createAsyncThunk(
  "tournaments/fetchAllTournamentsHcaHelpIn",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/tournaments/tournamentshcahelpin/fetchalltournamentshcahelpin"
      );
      const resData = await response.json();
      // console.log("das fjhakdf hlhsf", resData);

      return resData.allTournamentsHcaHelpIn;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// fetch all selected students  tournaments organized by hca
export const fetchAllSelectedStudentsTournamentsHcaHelpIn = createAsyncThunk(
  "tournaments/fetchAllSelectedStudentsTournamentsHcaHelpIn",
  async (studentId, { rejectWithValue }) => {
    try {
      const { data: resData } = await axios.post(
        "/api/tournaments/tournamentshcahelpin/fetchallselectedstudentstournamentshcahelpin",
        { studentId }
      );
      console.log("fetchAllSelectedStudentsTournamentsHcaHelpIn", resData);

      return resData.allSelectedStudentsTournamentsHcaHelpIn;
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

  // all tournaments organized by hca
  allTournamentsOrganizedByHcaList: [],
  allActiveTournamentsOrganizedByHcaList: [],
  allFilteredActiveTournamentsOrganizedByHcaList: [],
  allTournamentsOrganizedByHcaLoading: true,

  // all selected students tournaments organized by hca
  allSelectedStudentsTournamentsOrganizedByHcaList: [],
  allActiveSelectedStudentsTournamentsOrganizedByHcaList: [],
  allSelectedStudentsTournamentsOrganizedByHcaLoading: true,

  // all tournaments hca help in
  allTournamentsHcaHelpInList: [],
  allActiveTournamentsHcaHelpInList: [],
  allFilteredActiveTournamentsHcaHelpInList: [],
  allTournamentsHcaHelpInLoading: true,

  // all selected students tournaments hca help in
  allSelectedStudentsTournamentsHcaHelpInList: [],
  allActiveSelectedStudentsTournamentsHcaHelpInList: [],
  allSelectedStudentsTournamentsHcaHelpInLoading: true,
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

    // update allFilteredActiveTournamentsOrganizedByHcaList state
    filterTournamentOrganizedByHcaList: (state, action) => {
      state.allFilteredActiveTournamentsOrganizedByHcaList = action.payload;
    },
    // delete other tournament
    deleteTournamentOrganizedByHca: (state, action) => {
      const tournamentId = action.payload;

      let tempAllActiveTournamentOrganizedByHcaList =
        state.allActiveTournamentsOrganizedByHcaList?.filter(
          (tournament: any) => tournament?._id != tournamentId
        );
      state.allActiveTournamentsOrganizedByHcaList =
        tempAllActiveTournamentOrganizedByHcaList;
    },

    // update allFilteredActiveTournamentsHcaHelpInList state
    filterTournamentHcaHelpInList: (state, action) => {
      state.allFilteredActiveTournamentsHcaHelpInList = action.payload;
    },
    // delete tournament hca help in
    deleteTournamentHcaHelpIn: (state, action) => {
      const tournamentId = action.payload;

      let tempAllActiveTournamentHcaHelpInList =
        state.allActiveTournamentsHcaHelpInList?.filter(
          (tournament: any) => tournament?._id != tournamentId
        );
      state.allActiveTournamentsHcaHelpInList =
        tempAllActiveTournamentHcaHelpInList;
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
      )

      // tournaments organized by hca
      .addCase(fetchAllTournamentsOrganizedByHca.pending, (state) => {
        state.allTournamentsOrganizedByHcaLoading = true;
      })
      .addCase(fetchAllTournamentsOrganizedByHca.fulfilled, (state, action) => {
        console.log("after all tournaments organized by hca", action.payload);

        state.allTournamentsOrganizedByHcaList = action.payload?.sort(
          (a: any, b: any) =>
            dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
            dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
        );

        // Sorting  tournaments organized by hca by start date (latest first)

        const sortedTournamentsOrganizedByHca = action.payload
          ?.filter((tournament: any) => tournament?.activeStatus)
          ?.sort(
            (a: any, b: any) =>
              dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
              dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
          );

        // Filtering active  tournaments organized by hca after sorting
        state.allActiveTournamentsOrganizedByHcaList =
          sortedTournamentsOrganizedByHca;
        state.allFilteredActiveTournamentsOrganizedByHcaList =
          sortedTournamentsOrganizedByHca;

        state.allTournamentsOrganizedByHcaLoading = false;
      })

      // selected students tournaments organized by hca
      // tournaments organized by hca
      .addCase(
        fetchAllSelectedStudentsTournamentsOrganizedByHca.pending,
        (state) => {
          state.allSelectedStudentsTournamentsOrganizedByHcaLoading = true;
        }
      )
      .addCase(
        fetchAllSelectedStudentsTournamentsOrganizedByHca.fulfilled,
        (state, action) => {
          console.log(
            "after all selected students tournaments org by hca",
            action.payload
          );

          state.allSelectedStudentsTournamentsOrganizedByHcaList =
            action.payload?.sort(
              (a: any, b: any) =>
                dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
                dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
            );

          // Sorting other tournaments organized by hca by startdate (latest first)

          const sortedSelectedStudentsTournamentsOrganizedByHca = action.payload
            ?.filter((tournament: any) => tournament?.activeStatus)
            ?.sort(
              (a: any, b: any) =>
                dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
                dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
            );

          // Filtering active  tournaments organized by hca after sorting
          state.allActiveSelectedStudentsTournamentsOrganizedByHcaList =
            sortedSelectedStudentsTournamentsOrganizedByHca;

          state.allSelectedStudentsTournamentsOrganizedByHcaLoading = false;
        }
      )

      // tournaments hca help in
      .addCase(fetchAllTournamentsHcaHelpIn.pending, (state) => {
        state.allTournamentsHcaHelpInLoading = true;
      })
      .addCase(fetchAllTournamentsHcaHelpIn.fulfilled, (state, action) => {
        console.log("after all tournaments hca help in", action.payload);

        state.allTournamentsHcaHelpInList = action.payload?.sort(
          (a: any, b: any) =>
            dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
            dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
        );

        // Sorting  tournaments hca help in by start date (latest first)

        const sortedTournamentsHcaHelpIn = action.payload
          ?.filter((tournament: any) => tournament?.activeStatus)
          ?.sort(
            (a: any, b: any) =>
              dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
              dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
          );

        // Filtering active  tournaments hca help in after sorting
        state.allActiveTournamentsHcaHelpInList = sortedTournamentsHcaHelpIn;
        state.allFilteredActiveTournamentsHcaHelpInList =
          sortedTournamentsHcaHelpIn;

        state.allTournamentsHcaHelpInLoading = false;
      })

      // selected students tournaments organized by hca
      // tournaments organized by hca
      .addCase(
        fetchAllSelectedStudentsTournamentsHcaHelpIn.pending,
        (state) => {
          state.allSelectedStudentsTournamentsHcaHelpInLoading = true;
        }
      )
      .addCase(
        fetchAllSelectedStudentsTournamentsHcaHelpIn.fulfilled,
        (state, action) => {
          console.log(
            "after all selected students tournaments hca help in",
            action.payload
          );

          state.allSelectedStudentsTournamentsHcaHelpInList =
            action.payload?.sort(
              (a: any, b: any) =>
                dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
                dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
            );

          // Sorting other tournaments hca help in by startdate (latest first)

          const sortedSelectedStudentsTournamentsHcaHelpIn = action.payload
            ?.filter((tournament: any) => tournament?.activeStatus)
            ?.sort(
              (a: any, b: any) =>
                dayjs.tz(b.startDate, "Asia/Kathmandu").valueOf() -
                dayjs.tz(a.startDate, "Asia/Kathmandu").valueOf()
            );

          // Filtering active  tournaments hca help in after sorting
          state.allActiveSelectedStudentsTournamentsHcaHelpInList =
            sortedSelectedStudentsTournamentsHcaHelpIn;

          state.allSelectedStudentsTournamentsHcaHelpInLoading = false;
        }
      );
  },
});

export const {
  filterLichessTournamentList,
  deleteLichessTournament,
  filterOtherTournamentList,
  deleteOtherTournament,
  filterTournamentOrganizedByHcaList,
  deleteTournamentOrganizedByHca,
  filterTournamentHcaHelpInList,
  deleteTournamentHcaHelpIn,
} = allTournamentSlice.actions;

export default allTournamentSlice.reducer;
