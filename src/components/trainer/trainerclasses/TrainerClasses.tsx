import React, { useEffect, useState } from "react";
import ClassesHeader from "./ClassesHeader";
import StudentActivity from "./StudentActivity";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import { useSession } from "next-auth/react";
import TodaysClasses from "./TodaysClasses";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  fetchAllStudents,
  fetchTrainersTodayClasses,
  getAllCourses,
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
    selectedCourseLessons,
    status,
    error,
  } = useSelector((state: any) => state.trainerReducer);
  const [hasFetched, setHasFetched] = useState(false);

  // apply to all
  const [applyToAllClicked, setapplyToAllClicked] = useState(false);
  const [applyTopic, setapplyTopic] = useState("");

  // session for trainer data
  const session = useSession();

  // fetch initial trainers' classes and students on session change
  useEffect(() => {
    if (!hasFetched && session?.data?.user?._id) {
      dispatch(
        fetchTrainersTodayClasses({
          trainerId: session.data.user._id,
          todaysDate: dayjs().tz(timeZone).format(),
        })
      );
      dispatch(fetchAllStudents());
      setHasFetched(true);
    }
  }, [session, hasFetched]);

  // get initial course data
  useEffect(() => {
    dispatch(getAllCourses());
  }, []);

  return (
    <div className="flex w-full">
      {/* header-records */}
      <div className="header-records flex flex-col flex-1">
        <div className="top-section flex-[0.2] pt-3 pb-5 px-6 rounded-md w-full bg-white mb-3 shadow-sm">
          <ClassesHeader
            selectedTodaysClass={selectedTodaysClass}
            setapplyToAllClicked={setapplyToAllClicked}
            setapplyTopic={setapplyTopic}
            selectedCourseLessons={selectedCourseLessons}
          />
        </div>
        <div className="activity-section flex-1 p-3 px-6 bg-white rounded-md shadow-md">
          {selectedTodaysClass ? (
            <StudentActivity
              selectedStudentList={selectedStudentList}
              selectedTodaysClass={selectedTodaysClass}
              setapplyToAllClicked={setapplyToAllClicked}
              applyToAllClicked={applyToAllClicked}
              applyTopic={applyTopic}
              selectedCourseLessons={selectedCourseLessons}
            />
          ) : (
            // no assigned class selected
            <div className="noassignedclass h-full w-full flex items-center justify-center">
              <p className="text-lg flex items-center">
                <BrowserNotSupportedIcon />
                <span className="ml-2">Assigned class not selected</span>
              </p>
            </div>
          )}
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
