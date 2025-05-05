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

// get all users list
export const getAllCourses = createAsyncThunk(
  "courses/getAllCourses",
  async (_, { rejectWithValue }) => {
    try {
      // Use axios to make the get request
      const { data: resData } = await axios.get("/api/courses/getAllCourses");

      return resData.allCourses;
    } catch (error: any) {
      // Use rejectWithValue to handle errors
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState: any = {
  trainersTodaysClasses: [],
  selectedTodaysClass: null,
  studentList: [],
  allStudentActiveList: [],
  selectedStudentList: [],
  // course
  allCourseList: [],
  allActiveCourseList: [],
  selectedCourseLessons: [],

  // for attendance analysis
  attendanceStudentRecordsList: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
  loadingTodaysClasses: true,
};

const trainerSlice = createSlice({
  name: "assignClass",
  initialState,
  reducers: {
    // set todays class and update the student list of that selected batch
    selectTodaysClass: (state, action) => {
      const selectedClass = action.payload;
      state.selectedTodaysClass = selectedClass;

      const batchId = selectedClass.batchId;
      const isPlayDay = selectedClass.isPlayDay; // Destructure isPlayDay from selectedClass

      // If it's a PlayDay, filter HCA students with active batches and no endDate
      if (isPlayDay) {
        const filteredStudents = state.allStudentActiveList?.filter(
          (student: any) =>
            student.affiliatedTo?.toLowerCase() === "hca" &&
            student.batches.some(
              (batch: any) => batch.activeStatus === true && !batch.endDate
            )
        );

        // Set filtered students to selectedStudentList
        state.selectedStudentList = filteredStudents;
      } else {
        // Otherwise, filter based on batchId with activeStatus true and no endDate
        const filteredStudents = state.allStudentActiveList?.filter(
          (student: any) =>
            student.batches.some(
              (batch: any) =>
                batch.batchId === batchId &&
                batch.activeStatus === true &&
                !batch.endDate
            )
        );

        // Set filtered students to selectedStudentList
        state.selectedStudentList = filteredStudents;
      }

      // Retrieve all lessons from all courses
      let allLessons: any = [];
      state.allActiveCourseList.forEach((course: any) => {
        if (course.chapters) {
          course.chapters
            .filter((chapter: any) => chapter.activeStatus) // Only active chapters
            .forEach((chapter: any) => {
              // Flatten subChapters or include the chapter itself
              const chapterLessons = chapter.subChapters.length
                ? chapter.subChapters // If subChapters exist, use them
                : [chapter.chapterName]; // Otherwise, use the chapter name itself

              allLessons = allLessons.concat(chapterLessons); // Concatenate the lessons
            });
        }
      });

      // Set the all lessons to selectedCourseLessons state
      state.selectedCourseLessons = ["Play", "Test", ...allLessons];
    },

    // update todays classes record when trainer updates the student record
    updateTodaysClassRecord: (state, action) => {
      // console.log(" inside updateTodaysClassRecord reducer ", action.payload);
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
        state.studentList = action.payload;
        const sortedStudents = action.payload
          ?.filter((student: any) => student.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        state.allStudentActiveList = sortedStudents;
      })

      // for all course list
      .addCase(getAllCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCourses.fulfilled, (state, action: any) => {
        state.status = "succeeded";
        state.allCourseList = action.payload;
        // console.log("alactive courses", JSON.stringify(action.payload));

        const sortedCourses = action.payload
          ?.filter((course: any) => course.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        state.allActiveCourseList = sortedCourses;
      });
  },
});

export const {
  selectTodaysClass,
  updateTodaysClassRecord,
  updateAttendanceStudentRecordsList,
} = trainerSlice.actions;

export default trainerSlice.reducer;
