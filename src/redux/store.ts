import { configureStore } from "@reduxjs/toolkit";
import assignedClassesReducer from "@/redux/assignedClassesSlice";
import allListReducer from "@/redux/allListSlice";
import trainerReducer from "@/redux/trainerSlice";
import leaveRequestReducer from "@/redux/leaveRequestSlice";
import leaveApprovalReducer from "@/redux/leaveApprovalSlice";
import trainerHistoryReducer from "@/redux/trainerHistorySlice";
import activityRecordReducer from "@/redux/activityRecordSlice";
import attendanceReducer from "@/redux/attendanceSlice";
import testHistoryReducer from "@/redux/testHistorySlice";

export const myStore = configureStore({
  reducer: {
    assignedClassesReducer,
    allListReducer,
    trainerReducer,
    leaveRequestReducer,
    leaveApprovalReducer,
    trainerHistoryReducer,
    activityRecordReducer,
    attendanceReducer,
    testHistoryReducer,
  },
});
