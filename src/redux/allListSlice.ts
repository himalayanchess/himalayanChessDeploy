import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
// fetch all batches hca and others
export const fetchAllBatches = createAsyncThunk(
  "batches/getAllBatches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/batches/getAllBatches");
      const resData = await response.json();

      return resData.allBatches;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/// fetch all projects
export const fetchAllProjects = createAsyncThunk(
  "projects/getAllProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/projects/getAllProjects");
      const resData = await response.json();

      return resData.allProjects;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// get all students list
export const getAllStudents = createAsyncThunk(
  "students/getAllStudents",
  async (_, { rejectWithValue }) => {
    try {
      // Use axios to make the get request
      const { data: resData } = await axios.get("/api/students/getAllStudents");
      const allStudents = [
        ...resData.allHcaAffiliatedStudents,
        ...resData.allNonAffiliatedStudents,
      ];

      return allStudents;
    } catch (error: any) {
      // Use rejectWithValue to handle errors
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const allListSlice = createSlice({
  name: "allList",
  initialState: {
    // trainer list
    allTrainerList: [],
    allActiveTrainerList: [],
    allTrainerListLoading: true,
    // batches
    allBatches: [],
    allActiveBatches: [],
    allBatchesLoading: true,
    // batches
    allProjects: [],
    allActiveProjects: [],
    allProjectsLoading: true,
    // students
    allStudentsList: [],
    allActiveStudentsList: [],
    allFilteredActiveStudents: [],
    allStudentsLoading: true,
    status: "",
  },
  reducers: {
    filterStudentsList: (state, action) => {
      state.allFilteredActiveStudents = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // all trainers
      .addCase(fetchAllTrainers.pending, (state) => {
        state.allTrainerListLoading = true;
      })
      .addCase(fetchAllTrainers.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("after all trainers", action.payload);

        // Sorting trainers by createdAt (latest first)
        const sortedTrainers = action.payload?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        state.allTrainerList = sortedTrainers;

        // Filtering active trainers after sorting
        state.allActiveTrainerList = sortedTrainers?.filter(
          (trainer) => trainer.activeStatus
        );

        state.allTrainerListLoading = false;
      })
      .addCase(fetchAllTrainers.rejected, (state, action) => {
        state.status = "failed";
        state.allTrainerListLoading = false;
      })

      // all batches
      .addCase(fetchAllBatches.pending, (state) => {
        state.allBatchesLoading = true;
      })
      .addCase(fetchAllBatches.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("after all batches", action.payload);

        // Sorting batches by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedBatches = action.payload?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        state.allBatches = sortedBatches;

        // Filtering active batches after sorting
        state.allActiveBatches = sortedBatches?.filter(
          (batch) => batch.activeStatus
        );

        state.allBatchesLoading = false;
      })
      // all projects
      .addCase(fetchAllProjects.pending, (state) => {
        state.allProjectsLoading = true;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("after all Projects", action.payload);

        // Sorting Projects by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedProjects = action.payload?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        state.allProjects = sortedProjects;

        // Filtering active Projects after sorting
        state.allActiveProjects = sortedProjects?.filter(
          (project) => project.activeStatus
        );

        state.allProjectsLoading = false;
      })
      // all students
      .addCase(getAllStudents.pending, (state) => {
        state.allStudentsLoading = true;
      })
      .addCase(getAllStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("after all students", action.payload);

        state.allStudentsList = action.payload?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sorting Projects by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedStudents = action.payload
          ?.filter((student) => student.activeStatus)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Filtering active Projects after sorting
        state.allActiveStudentsList = sortedStudents;
        state.allFilteredActiveStudents = sortedStudents;
        state.allStudentsLoading = false;
      });
  },
});

export const { filterStudentsList } = allListSlice.actions;

export default allListSlice.reducer;
