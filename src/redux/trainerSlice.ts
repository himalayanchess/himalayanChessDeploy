import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch assigned classes
export const fetchTrainersTodayClasses = createAsyncThunk(
  "trainer/getTrainersTodaysClasses",
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

// Async thunk to fetch assigned classes
export const fetchAllStudents = createAsyncThunk(
  "trainer/getAllStudents",
  async (_, { rejectWithValue }) => {
    try {
      console.log("teacher slice fetchAllStudents slice");

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

const trainerSlice = createSlice({
  name: "assignClass",
  initialState: {
    trainersTodaysClasses: [],
    selectedTodaysClass: null,
    studentList: [],
    selectedStudentList: [],
    // for attendance analysis
    attendanceStudentRecordsList: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
    loadingTodaysClasses: true,
  },
  reducers: {
    // set todays class and update the student list of that selected batch
    selectTodaysClass: (state, action) => {
      const selectedClass = action.payload;
      state.selectedTodaysClass = selectedClass;

      const batchId = selectedClass.batchId;
      // Filter students who have a batch with the given 'batchId' and 'activeStatus' as true
      const filteredStudents = state.studentList?.filter((student) =>
        student.batches.some(
          (batch) =>
            batch.batchId === batchId &&
            batch.activeStatus === true &&
            !batch.endDate
        )
      );
      state.selectedStudentList = filteredStudents;
    },

    // update todays classes record when trainer updates the student record
    updateTodaysClassRecord: (state, action) => {
      console.log(" inside updateTodaysClassRecord reducer ", action.payload);
      const updatedRecord = action.payload;
      const tempTrainersTodaysClasses = state.trainersTodaysClasses?.map(
        (todaysClass: any) => {
          if (todaysClass?._id == updatedRecord?._id) {
            return updatedRecord;
          } else {
            return todaysClass;
          }
        }
      );
      state.trainersTodaysClasses = tempTrainersTodaysClasses;
    },

    // update attendanceStudentRecordsList for analysis
    updateAttendanceStudentRecordsList: (state, action) => {
      // const tempStudents = JSON.stringify(action.payload);
      // console.log(tempStudents);

      state.attendanceStudentRecordsList = action.payload.attendanceStudents;
    },
  },
  extraReducers: (builder) => {
    builder
      // for trainers todays classes
      .addCase(fetchTrainersTodayClasses.pending, (state) => {
        state.status = "loading";
        state.loadingTodaysClasses = true;
      })
      .addCase(fetchTrainersTodayClasses.fulfilled, (state, action: any) => {
        state.status = "succeeded";
        // set all assigned classes
        state.trainersTodaysClasses = action.payload;
        state.loadingTodaysClasses = false;
      })
      .addCase(fetchTrainersTodayClasses.rejected, (state, action) => {
        state.status = "failed";
        state.loadingTodaysClasses = false;
      })
      // for all students list
      .addCase(fetchAllStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllStudents.fulfilled, (state, action: any) => {
        state.status = "succeeded";
        state.studentList = action.payload.updatedRecord;
      });
  },
});

export const {
  selectTodaysClass,
  updateTodaysClassRecord,
  updateAttendanceStudentRecordsList,
} = trainerSlice.actions;

export default trainerSlice.reducer;
