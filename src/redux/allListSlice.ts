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
// get all users list
export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      // Use axios to make the get request
      const { data: resData } = await axios.get("/api/users/getAllUsers");

      return resData.allUsers;
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
// get all branch list
export const getAllBranches = createAsyncThunk(
  "branches/getAllBranches",
  async (_, { rejectWithValue }) => {
    try {
      // Use axios to make the get request
      const { data: resData } = await axios.get("/api/branches/getAllBranches");

      return resData.allBranches;
    } catch (error: any) {
      // Use rejectWithValue to handle errors
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// get all study materials
export const getAllStudyMaterials = createAsyncThunk(
  "studymaterials/getAllStudyMaterials",
  async (_, { rejectWithValue }) => {
    try {
      // Use axios to make the get request
      const { data: resData } = await axios.get(
        "/api/studymaterials/getAllStudyMaterials"
      );

      return resData.allStudyMaterials;
    } catch (error: any) {
      // Use rejectWithValue to handle errors
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState: any = {
  allTrainerList: [],
  allActiveTrainerList: [],
  allTrainerListLoading: true,

  allBatches: [],
  allActiveBatches: [],
  allFilteredActiveBatches: [],
  allBatchesLoading: true,

  allProjects: [],
  allActiveProjects: [],
  allFilteredActiveProjects: [],
  allProjectsLoading: true,

  allStudentsList: [],
  allActiveStudentsList: [],
  allFilteredActiveStudents: [],
  allStudentsLoading: true,

  allUsersList: [],
  allActiveUsersList: [],
  allFilteredActiveUsersList: [],
  allUsersLoading: true,

  allCoursesList: [],
  allActiveCoursesList: [],
  allFilteredActiveCoursesList: [],
  allCoursesLoading: true,

  allBranchesList: [],
  allActiveBranchesList: [],
  allFilteredActiveBranchesList: [],
  allBranchesLoading: true,

  allStudyMaterialsList: [],
  allActiveStudyMaterialsList: [],
  allFilteredActiveStudyMaterialsList: [],
  allStudyMaterialsLoading: true,

  status: "",
};

const allListSlice = createSlice({
  name: "allList",
  initialState,
  reducers: {
    // update allFilteredActiveStudents state
    filterStudentsList: (state, action) => {
      state.allFilteredActiveStudents = action.payload;
    },
    // delete student
    deleteStudent: (state, action) => {
      const studentId = action.payload;

      let tempAllActiveStudentsList = state.allActiveStudentsList?.filter(
        (student: any) => student?._id != studentId
      );
      state.allActiveStudentsList = tempAllActiveStudentsList;
    },

    // update allFilteredActiveStudents state
    filterUsersList: (state, action) => {
      state.allFilteredActiveUsersList = action.payload;
    },
    // delete user
    deleteUser: (state, action) => {
      const userId = action.payload;

      let tempAllActiveUsersList = state.allActiveUsersList?.filter(
        (student: any) => student?._id != userId
      );
      state.allActiveUsersList = tempAllActiveUsersList;
    },

    // update allFilteredProjects state
    filterProjectsList: (state, action) => {
      state.allFilteredActiveProjects = action.payload;
    },
    // delete user
    deleteProject: (state, action) => {
      const projectId = action.payload;

      let tempAllActiveProjectsList = state.allActiveProjects?.filter(
        (student: any) => student?._id != projectId
      );
      state.allActiveProjects = tempAllActiveProjectsList;
    },

    // update allFilteredActiveBatches state
    filterBatchesList: (state, action) => {
      state.allFilteredActiveBatches = action.payload;
    },
    // delete user
    deleteBatch: (state, action) => {
      const batchId = action.payload;

      let tempAllActiveBatchesList = state.allActiveBatches?.filter(
        (student: any) => student?._id != batchId
      );
      state.allActiveBatches = tempAllActiveBatchesList;
    },

    // update allFilteredActiveCourses state
    filterCourseList: (state, action) => {
      state.allFilteredActiveCoursesList = action.payload;
    },
    // delete user
    deleteCourse: (state, action) => {
      const courseId = action.payload;

      let tempAllActiveCoursesList = state.allActiveCoursesList?.filter(
        (course: any) => course?._id != courseId
      );
      state.allActiveCoursesList = tempAllActiveCoursesList;
    },
    // update allFilteredActiveBranchesstate
    filterBranchList: (state, action) => {
      state.allFilteredActiveBranchesList = action.payload;
    },
    // delete user
    deleteBranch: (state, action) => {
      const branchId = action.payload;

      let tempAllActiveBranchesList = state.allActiveBranchesList?.filter(
        (branch: any) => branch?._id != branchId
      );
      state.allActiveBranchesList = tempAllActiveBranchesList;
    },
    // add new study material
    addNewStudyMaterial: (state, action) => {
      console.log("new file", action.payload);

      state.allActiveStudyMaterialsList = [
        ...state.allActiveStudyMaterialsList,
        action.payload,
      ];
    },
    // delete study material
    deleteStudyMaterial: (state, action) => {
      const studyMaterialId = action.payload;

      let tempAllStudyMaterialList = state.allActiveStudyMaterialsList?.filter(
        (studyMaterial: any) => studyMaterial?._id != studyMaterialId
      );
      state.allActiveStudyMaterialsList = tempAllStudyMaterialList;
    },
    filterStudyMaterialsList: (state, action) => {
      state.allFilteredActiveStudyMaterialsList = action.payload;
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
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        state.allTrainerList = sortedTrainers;

        // Filtering active trainers after sorting
        state.allActiveTrainerList = sortedTrainers?.filter(
          (trainer: any) => trainer.activeStatus
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

        state.allBatches = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sorting batches by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedBatches = action.payload
          ?.filter((batch: any) => batch.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        state.allActiveBatches = sortedBatches;
        state.allFilteredActiveBatches = sortedBatches;
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
        state.allProjects = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Sorting Projects by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedProjects = action.payload
          ?.filter((project: any) => project.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Filtering active Projects after sorting
        state.allActiveProjects = sortedProjects;
        state.allFilteredActiveProjects = sortedProjects;
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
      })

      // all users
      .addCase(getAllUsers.pending, (state) => {
        state.allUsersLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("after all users", action.payload);

        state.allUsersList = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sorting Projects by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedUsers = action.payload
          ?.filter((user: any) => user.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Filtering active Projects after sorting
        state.allActiveUsersList = sortedUsers;
        state.allFilteredActiveUsersList = sortedUsers;
        state.allUsersLoading = false;
      })

      // all courses
      .addCase(getAllCourses.pending, (state) => {
        state.allCoursesLoading = true;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("after all courses", action.payload);

        state.allCoursesList = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sorting Projects by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedCourses = action.payload
          ?.filter((course: any) => course.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Filtering active Projects after sorting
        state.allActiveCoursesList = sortedCourses;
        state.allFilteredActiveCoursesList = sortedCourses;
        state.allCoursesLoading = false;
      })
      // all branches
      .addCase(getAllBranches.pending, (state) => {
        state.allBranchesLoading = true;
      })
      .addCase(getAllBranches.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("after all Branches", action.payload);

        state.allBranchesList = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sorting Projects by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedBranches = action.payload
          ?.filter((branch: any) => branch.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Filtering active Projects after sorting
        state.allActiveBranchesList = sortedBranches;
        state.allFilteredActiveBranchesList = sortedBranches;
        state.allBranchesLoading = false;
      })

      // all study materials
      .addCase(getAllStudyMaterials.pending, (state) => {
        state.allStudyMaterialsLoading = true;
      })
      .addCase(getAllStudyMaterials.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("after all study materials", action.payload);

        state.allStudyMaterialsList = action.payload?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sorting Projects by createdAt (assuming createdAt is a valid date string or timestamp)
        const sortedStudyMaterials = action.payload
          ?.filter((studyMaterial: any) => studyMaterial.activeStatus)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Filtering active Projects after sorting
        state.allActiveStudyMaterialsList = sortedStudyMaterials;
        state.allFilteredActiveStudyMaterialsList = sortedStudyMaterials;
        state.allStudyMaterialsLoading = false;
      });
  },
});

export const {
  filterStudentsList,
  filterUsersList,
  deleteStudent,
  deleteUser,
  filterProjectsList,
  deleteProject,
  filterBatchesList,
  deleteBatch,
  filterCourseList,
  deleteCourse,
  filterBranchList,
  deleteBranch,
  addNewStudyMaterial,
  deleteStudyMaterial,
  filterStudyMaterialsList,
} = allListSlice.actions;

export default allListSlice.reducer;
