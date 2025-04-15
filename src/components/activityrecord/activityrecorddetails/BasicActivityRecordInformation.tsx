import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { useSession } from "next-auth/react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicActivityRecordInformation = ({ activityRecord }: any) => {
  const session = useSession();

  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY, dddd");
  };

  const formatTime = (time: string) => {
    return dayjs(time).tz(timeZone).format("hh:mm A");
  };

  return (
    <div className="grid grid-cols-2 w-full gap-4">
      {/* Session Date Card */}
      <div className="bg-gray-50 rounded-xl  p-4 grid grid-cols-2">
        <div className="col-span-2">
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-bold text-2xl ">
            {formatDate(activityRecord?.nepaliDate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Start Time</p>
          <p className="font-medium text-xl">
            {formatTime(activityRecord?.startTime)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">End Time</p>
          <p className="font-medium text-xl">
            {formatTime(activityRecord?.endTime)}
          </p>
        </div>
      </div>

      {/* Header Card */}
      <div className={`bg-gray-50 rounded-xl  p-4 `}>
        <div className="col-span-2 flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Trainer</p>
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/users/${
                activityRecord?.trainerId
              }`}
              className="font-medium text-xl underline  hover:text-blue-500"
            >
              {activityRecord.trainerName}
            </Link>
          </div>

          {/* present status */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              activityRecord?.userPresentStatus?.toLowerCase() === "present"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {activityRecord.userPresentStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 mt-2 gap-1">
          <div>
            <p className="text-sm text-gray-500">Trainer</p>
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/batches/${
                activityRecord?.batchId
              }`}
              className="font-medium text-md underline  hover:text-blue-500"
            >
              {activityRecord.batchName}
            </Link>
          </div>

          <div>
            <p className="text-sm text-gray-500">Affiliated To</p>
            <p className="font-medium">
              {activityRecord.affiliatedTo || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Project</p>
            <p className="font-medium">{activityRecord.projectName || "N/A"}</p>
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

      {/* Date & Time Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Week Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-gray-700 mb-3">Week Information</h2>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Week Number</p>
              <p className="font-medium">
                #{activityRecord.weekNumber || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Week Start</p>
              <p className="font-medium">
                {formatDate(activityRecord?.weekStartDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Week End</p>
              <p className="font-medium">
                {formatDate(activityRecord?.weekEndDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Study Topic Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {activityRecord.courseName}
        </h1>
        <h2 className="font-semibold text-gray-700 mb-3">Study Topic</h2>
        <p className="text-gray-800">
          {activityRecord.mainStudyTopic ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        </p>
      </div>
    </div>
  );
};

export default BasicActivityRecordInformation;
