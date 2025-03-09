import { configureStore } from "@reduxjs/toolkit";
import assignedClassesReducer from "@/redux/assignedClassesSlice";
export const myStore = configureStore({
  reducer: {
    assignedClassesReducer,
  },
});
