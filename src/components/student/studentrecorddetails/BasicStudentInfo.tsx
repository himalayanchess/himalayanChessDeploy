import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { ReceiptText, MapPinHouse, Contact } from "lucide-react";
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
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicStudentInfo = ({ studentRecord }: any) => {
  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY");
  };

  return (
    <div className="grid grid-cols-2 auto-rows-max w-full gap-4">
      {/* Basic Information */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          <InfoOutlinedIcon />
          <span className="ml-0.5">Basic Information</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <div className="detail flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
              <p className="font-medium ml-1">{studentRecord?.name || "N/A"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500">Gender</p>
            <div className="detail flex items-center">
              {studentRecord?.gender?.toLowerCase() === "female" ? (
                <FemaleIcon sx={{ color: "gray " }} />
              ) : (
                <MaleIcon sx={{ color: "gray " }} />
              )}
              <p className="font-medium ml-1">
                {studentRecord?.gender || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date of Birth</p>
            <div className="detail flex items-center">
              <EventOutlinedIcon sx={{ color: "gray " }} />
              <p className="font-medium ml-1">
                {studentRecord?.dob ? formatDate(studentRecord?.dob) : "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500">Affiliated To</p>
            <p className="font-medium">
              {studentRecord?.affiliatedTo || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Joined Date</p>
            <p className="font-medium">
              {studentRecord?.joinedDate
                ? formatDate(studentRecord?.joinedDate)
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">End Date</p>
            <p className="font-medium">
              {studentRecord?.endDate
                ? formatDate(studentRecord?.endDate)
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          <Contact />
          <span className="ml-1">Contact Information</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <div className="detail flex items-center">
              <CallOutlinedIcon sx={{ color: "gray" }} />
              <p className="font-medium ml-1">
                {studentRecord?.phone || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <div className="detail flex items-center">
              <MapPinHouse className="text-gray-500" />
              <p className="font-medium ml-1">
                {studentRecord?.address || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gray-50 rounded-xl p-4 col-span-2">
        <p className="text-sm text-gray-500 mb-2 font-bold">
          <ContactPhoneOutlinedIcon />
          <span className="ml-1">Emergency Contact</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-medium flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.emergencyContactName || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium flex items-center">
              <CallOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.emergencyContactNo || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Relation</p>
            <p className="font-medium flex items-center">
              <PersonPinCircleOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.emergencyContactRelation || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Guardian Information */}
      <div className="bg-gray-50 rounded-xl p-4 col-span-2">
        <p className="text-sm text-gray-500 mb-2 font-bold">
          <SupervisorAccountOutlinedIcon />
          <span className="ml-1">Guardian Information</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500">Guardian Name</p>
            <p className="font-medium flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.guardianInfo?.name || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Guardian Phone</p>
            <p className="font-medium flex items-center">
              <CallOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.guardianInfo?.phone || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Relation</p>
            <p className="font-medium flex items-center">
              <PersonPinCircleOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {studentRecord?.guardianInfo?.relation || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicStudentInfo;
