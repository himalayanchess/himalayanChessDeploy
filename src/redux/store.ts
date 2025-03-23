import { configureStore } from "@reduxjs/toolkit";
import assignedClassesReducer from "@/redux/assignedClassesSlice";
import allListReducer from "@/redux/allListSlice";
import trainerReducer from "@/redux/trainerSlice";
import leaveRequestReducer from "@/redux/leaveRequestSlice";
import leaveApprovalReducer from "@/redux/leaveApprovalSlice";
import trainerHistoryReducer from "@/redux/trainerHistorySlice";

export const myStore = configureStore({
  reducer: {
    assignedClassesReducer,
    allListReducer,
    trainerReducer,
    leaveRequestReducer,
    leaveApprovalReducer,
    trainerHistoryReducer,
  },
});
