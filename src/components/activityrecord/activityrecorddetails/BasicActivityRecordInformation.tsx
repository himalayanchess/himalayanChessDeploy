import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { useSession } from "next-auth/react";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import {
  TimerReset,
  Component,
  School,
  Crown,
  BookOpenText,
  CalendarArrowUp,
  CalendarArrowDown,
  MapPinHouse,
  CalendarCheck2,
} from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicActivityRecordInformation = ({ activityRecord }: any) => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY, dddd");
  };

  const formatTime = (time: string) => {
    return dayjs(time).tz(timeZone).format("hh:mm A");
  };

  return (
    <div className="grid grid-cols-2 auto-rows-max w-full gap-4">
      {/* Time - holiday info */}
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="">
          <p className="text-sm text-gray-500">Date</p>
          <div className="flex items-center">
            <EventOutlinedIcon sx={{ color: "gray" }} />
            <p className="font-bold text-2xl ml-1 ">
              {formatDate(activityRecord?.nepaliDate)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Start Time</p>
            <p className="font-medium text-lg flex items-center">
              <TimerReset className="text-gray-500" />
              <span className="ml-1">
                {formatTime(activityRecord?.startTime)}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Time</p>
            <p className="font-medium text-lg flex items-center">
              <TimerReset className="text-gray-500" />
              <span className="ml-1">
                {formatTime(activityRecord?.endTime)}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Assigned By</p>
            <AssignmentIndOutlinedIcon sx={{ color: "gray" }} />
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/users/${
                activityRecord?.assignedById
              }`}
              className="font-medium ml-1 text-lg underline hover:text-blue-500"
            >
              {activityRecord?.assignedByName}
            </Link>
          </div>
          <div>
            <p className="text-sm text-gray-500">Holiday</p>
            <p className="font-medium text-md">
              {activityRecord?.holidayStatus
                ? activityRecord?.holidayDescription || "Holiday"
                : "No"}
            </p>
          </div>
          {activityRecord?.affiliatedTo?.toLowerCase() == "hca" && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Branch</p>
              <div className="detail flex items-center">
                <MapPinHouse className="text-gray-500 mr-1" />
                {!isSuperOrGlobalAdmin ? (
                  <p className="text-gray-700 text-md">
                    {activityRecord?.branchName || "N/A"}
                  </p>
                ) : (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                      activityRecord?.branchId
                    }`}
                    className="font-medium ml-1 text-md underline hover:text-blue-500"
                  >
                    {activityRecord?.branchName}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* trainer Card */}
      <div className={`bg-gray-50 rounded-xl  p-4 `}>
        <div className="col-span-2 flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Trainer</p>
            <div className="flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray" }} />
              {session?.data?.user?.role?.toLowerCase() !== "trainer" ? (
                <Link
                  href={`/${session?.data?.user?.role?.toLowerCase()}/users/${
                    activityRecord?.trainerId
                  }`}
                  className="font-medium ml-1 text-xl underline hover:text-blue-500"
                >
                  {activityRecord.trainerName}
                </Link>
              ) : (
                <span className="font-medium ml-1 text-xl">
                  {activityRecord.trainerName}
                </span>
              )}
            </div>
          </div>

          {/* present status */}
          <span className={`px-3 py-1 rounded-full text-xs bg-gray-200`}>
            Trainer Role:{" "}
            <span className="font-bold">{activityRecord.trainerRole}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Batch</p>
            <div className="flex items-center">
              <Component className="text-gray-500" />
              {activityRecord?.batchId ? (
                session?.data?.user?.role?.toLowerCase() !== "trainer" ? (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/batches/${
                      activityRecord?.batchId
                    }`}
                    className="font-medium ml-1 text-md underline hover:text-blue-500"
                  >
                    {activityRecord?.batchName}
                  </Link>
                ) : (
                  <span className="font-medium ml-1 text-md">
                    {activityRecord?.batchName}
                  </span>
                )
              ) : (
                <p className="font-medium ml-1 text-md ">
                  {activityRecord.batchName}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Affiliated To</p>
            <p className="font-medium">
              {activityRecord.affiliatedTo || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Project</p>
            <div className="flex items-center">
              <School className="text-gray-500" />
              <p className="font-medium ml-1">
                {activityRecord.projectName || "N/A"}
              </p>
            </div>
          </div>
          <div className={``}>
            <p className="text-sm text-gray-500 mb-1">Playday</p>
            <div className="flex items-center">
              <Crown className="text-gray-500" />
              <p
                className={`font-medium  ml-1 rounded-full text-sm px-3 py-0.5 w-max ${
                  activityRecord.isPlayDay ? " bg-green-200" : ""
                }`}
              >
                {activityRecord.isPlayDay ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {activityRecord.holidayStatus && (
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                Holiday
              </span>
            )}
          </div>
        </div>
      </div>

      {/* course information */}
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="">
          <p className="text-sm text-gray-500 mb-1">Course</p>
          <div className="flex items-center">
            <BookOpenText className="text-gray-500" />
            {activityRecord?.courseId ? (
              session?.data?.user?.role?.toLowerCase() !== "trainer" ? (
                <Link
                  href={`/${session?.data?.user?.role?.toLowerCase()}/courses/${
                    activityRecord?.courseId
                  }`}
                  className="font-medium ml-1 text-md underline hover:text-blue-500"
                >
                  {activityRecord?.courseName || "N/A"}
                </Link>
              ) : (
                // Optional: Show something else or nothing if role is 'trainer'
                <span className="font-medium ml-1 text-md">
                  {activityRecord?.courseName || "N/A"}
                </span>
              )
            ) : (
              <p className="font-medium ml-1 text-md text-gray-700">N/A</p>
            )}
          </div>
        </div>

        <div className=" mt-2 grid grid-cols-2 gap-1">
          <div>
            <p className="text-sm text-gray-500">Main Study Topic</p>
            <p className="font-medium text-md">
              <StickyNote2OutlinedIcon sx={{ color: "gray" }} />
              <span className="ml-1">
                {activityRecord?.mainStudyTopic || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Class Number</p>
            <p className="font-medium text-md text-gray-500 flex items-center">
              <CalendarCheck2 />
              <span className="ml-2 text-xl font-bold">
                {activityRecord?.currentClassNumber || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* week information */}
      <div className="bg-gray-50 rounded-xl grid grid-cols-2 p-4 ">
        <div>
          <p className="text-sm text-gray-500">Week Start Date</p>
          <p className="font-medium text-md flex items-center">
            <CalendarArrowUp className="text-gray-500" />
            <span className="ml-1">
              {formatDate(activityRecord?.weekStartDate)}
            </span>
          </p>
        </div>{" "}
        <div>
          <p className="text-sm text-gray-500">Week End Date</p>
          <p className="font-medium text-md flex items-center">
            <CalendarArrowDown className="text-gray-500 " />
            <span className="ml-1">
              {formatDate(activityRecord?.weekEndDate)}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 mt-2 gap-1">
          <div>
            <p className="text-sm text-gray-500">Week Number</p>
            <p className="font-medium text-md">#{activityRecord?.weekNumber}</p>
          </div>
        </div>
      </div>

      <div className={`bg-gray-50 col-span-2 rounded-xl  p-4 `}>
        <p className="font-bold text-gray-500 text-sm">Class Description</p>
        <div>
          <p className="text-md text-gray-500">
            {activityRecord?.description?.trim() || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicActivityRecordInformation;
