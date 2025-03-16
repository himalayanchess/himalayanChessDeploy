import { configureStore } from "@reduxjs/toolkit";
import assignedClassesReducer from "@/redux/assignedClassesSlice";
import allListReducer from "@/redux/allListSlice";
import trainerReducer from "@/redux/trainerSlice";

export const myStore = configureStore({
  reducer: {
    assignedClassesReducer,
    allListReducer,
    trainerReducer,
  },
});
