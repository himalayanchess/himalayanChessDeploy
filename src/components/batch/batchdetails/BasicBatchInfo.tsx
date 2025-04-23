import React from "react";
import {
  ReceiptText,
  MapPinHouse,
  Contact,
  School,
  TimerReset,
} from "lucide-react";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";
import { useSession } from "next-auth/react";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicBatchInfo = ({ batchRecord }: any) => {
  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY");
  };
  const session = useSession();

  return (
    <div className="grid grid-cols-2 auto-rows-max w-full gap-4">
      {/* Basic Batch Information */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          <InfoOutlinedIcon />
          <span className="ml-0.5">Basic Information</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Name</p>
            <div className="detail flex items-center">
              {/* <PersonOutlineOutlinedIcon sx={{ color: "gray " }} /> */}
              <p className="font-bold text-xl  ml-1">
                {batchRecord?.batchName || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium text-lg flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {formatDate(batchRecord?.batchStartDate)}
              </span>
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium text-lg flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {batchRecord?.batchEndDate
                  ? formatDate(batchRecord?.batchEndDate)
                  : "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* affliated to */}
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="grid grid-cols-2">
          <div className="">
            <p className="text-sm text-gray-500">Affilaited To</p>
            <div className="flex items-center">
              {/* <EventOutlinedIcon sx={{ color: "gray" }} /> */}
              <p className="font-medium   ml-1 ">{batchRecord?.affiliatedTo}</p>
            </div>
          </div>
          <div className="">
            <p className="text-sm text-gray-500">Completed Status</p>
            <div className="flex items-center">
              {/* <EventOutlinedIcon sx={{ color: "gray" }} /> */}
              <p className="font-medium   ml-1 ">
                {batchRecord?.completedStatus}
              </p>
            </div>
          </div>
        </div>
        {/* projectname */}
        <div className="mt-1">
          <p className="text-sm text-gray-500 mb-1">Project</p>
          <div className="flex items-center">
            <School className="text-gray-500" />
            {batchRecord?.projectId ? (
              <Link
                href={`/${session?.data?.user?.role?.toLowerCase()}/projects/${
                  batchRecord?.projectId
                }`}
                className="font-medium ml-1 text-lg underline hover:text-blue-500"
              >
                {batchRecord.projectName}
              </Link>
            ) : (
              <p className="font-medium ml-1">N/A</p>
            )}
          </div>
        </div>
        {/* branch name */}
        {batchRecord?.affiliatedTo?.toLowerCase() == "hca" && (
          <div className="mt-1">
            <p className="text-sm text-gray-500 mb-1">Branch</p>
            <div className="flex items-center">
              {/* <School className="text-gray-500" /> */}
              {batchRecord?.branchName ? (
                <Link
                  href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                    batchRecord?.branchId
                  }`}
                  className="font-medium ml-1 text-lg underline hover:text-blue-500"
                >
                  {batchRecord.branchName}
                </Link>
              ) : (
                <p className="font-medium ml-1">N/A</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicBatchInfo;
