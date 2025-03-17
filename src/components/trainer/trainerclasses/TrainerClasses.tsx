import React, { useEffect, useState } from "react";
import ClassesHeader from "./ClassesHeader";
import StudentActivity from "./StudentActivity";
import { useSession } from "next-auth/react";
import TodaysClasses from "./TodaysClasses";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  fetchAllStudents,
  fetchTrainersTodayClasses,
} from "@/redux/trainerSlice";
import { useDispatch, useSelector } from "react-redux";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const TrainerClasses = () => {
  // use dispatch
  const dispatch = useDispatch<any>();
  // use selector to get trainers' today's classes and loading state
  const {
    trainersTodaysClasses,
    loadingTodaysClasses,
    selectedStudentList,
    selectedTodaysClass,
    status,
    error,
  } = useSelector((state) => state.trainerReducer);

  console.log(selectedTodaysClass);

  // apply to all
  const [applyToAllClicked, setapplyToAllClicked] = useState(false);
  const [applyTopic, setapplyTopic] = useState("");

  // session for trainer data
  const session = useSession();

  // fetch initial trainers' classes and students on session change
  useEffect(() => {
    if (session?.data?.user?._id) {
      // Fetch today's classes and all students only when session is available
      dispatch(
        fetchTrainersTodayClasses({
          trainerId: session.data.user._id,
          todaysDate: dayjs().tz(timeZone).format(),
        })
      );
      dispatch(fetchAllStudents());
    }
  }, [session]);

  return (
    <div className="flex w-full">
      {/* header-records */}
      <div className="header-records flex flex-col flex-1">
        <div className="top-section flex-[0.2] pt-3 pb-5 px-6 rounded-md w-full bg-white mb-3 shadow-sm">
          <ClassesHeader
            selectedTodaysClass={selectedTodaysClass}
            setapplyToAllClicked={setapplyToAllClicked}
            setapplyTopic={setapplyTopic}
          />
        </div>
        <div className="activity-section flex-1 p-3 px-6 bg-white rounded-md shadow-md">
          <StudentActivity
            selectedStudentList={selectedStudentList}
            selectedTodaysClass={selectedTodaysClass}
            setapplyToAllClicked={setapplyToAllClicked}
            applyToAllClicked={applyToAllClicked}
            applyTopic={applyTopic}
          />
        </div>
      </div>
      <div className="todays-classes flex-[0.3] ml-4">
        <TodaysClasses
          trainersTodaysClasses={trainersTodaysClasses}
          loadingTodaysClasses={loadingTodaysClasses}
          selectedTodaysClass={selectedTodaysClass}
        />
      </div>
    </div>
  );
};

export default TrainerClasses;
