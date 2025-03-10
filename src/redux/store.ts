import { configureStore } from "@reduxjs/toolkit";
import assignedClassesReducer from "@/redux/assignedClassesSlice";
import allListReducer from "@/redux/allListSlice";
export const myStore = configureStore({
  reducer: {
    assignedClassesReducer,
    allListReducer,
  },
});
