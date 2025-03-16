import React, { useEffect } from "react";
import ClassesHeader from "./ClassesHeader";
import StudentActivity from "./StudentActivity";
import { useSession } from "next-auth/react";
import TodaysClasses from "./TodaysClasses";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { fetchTrainersTodayClasses } from "@/redux/trainerSlice";
import { useDispatch, useSelector } from "react-redux";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const TrainerClasses = () => {
  // use dispatch
  const dispatch = useDispatch<any>();
  // use selector
  const { trainersTodaysClasses, status, error } = useSelector(
    (state) => state.trainerReducer
  );
  console.log("use selecte", trainersTodaysClasses);

  // all data fecthing here
  const session = useSession();

  // fetch initial trainers todays classes and store in redux state
  useEffect(() => {
    if (session) {
      dispatch(
        fetchTrainersTodayClasses({
          trainerId: session?.data?.user?._id,
          todaysDate: dayjs().tz(timeZone).format(),
        })
      );
    }
  }, [session]);

  return (
    <div className="flex w-full">
      {/* header-records */}
      <div className="header-records flex flex-col flex-1">
        {/* header section */}
        <div className="top-section flex-[0.2] py-3 px-6 rounded-md w-full bg-white mb-3">
          <ClassesHeader />
        </div>
        {/* student activity  */}
        <div className="activity-section flex-1 py-3 px-6 bg-white rounded-md">
          <StudentActivity />
        </div>
      </div>
      <div className="todays-classes flex-[0.3] bg-white ml-4 rounded-md px-6 py-3">
        <TodaysClasses trainersTodaysClasses={trainersTodaysClasses} />
      </div>
    </div>
  );
};

export default TrainerClasses;
