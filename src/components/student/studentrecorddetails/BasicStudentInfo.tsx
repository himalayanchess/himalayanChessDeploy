import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { ReceiptText, MapPinHouse, Contact, Crown, IdCard } from "lucide-react";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import { useSession } from "next-auth/react";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicStudentInfo = ({ studentRecord }: any) => {
  const session = useSession();
  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMM D, YYYY");
  };

  return (
    <div className="grid grid-cols-2 auto-rows-max w-full gap-4">
      {/* Basic Information */}
      <div className="bg-gray-50 rounded-xl p-4">
        {/* <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          <InfoOutlinedIcon />
          <span className="ml-0.5">Basic Information</span>
        </p> */}
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Name</p>
            <div className="detail flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
              <p className="font-bold ml-1 text-xl">
                {studentRecord?.name || "N/A"}
              </p>
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
          <div>
            <p className="text-xs text-gray-500">Affiliated To</p>
            <p className="font-medium">
              {studentRecord?.affiliatedTo || "N/A"}
            </p>
          </div>
          {studentRecord?.affiliatedTo?.toLowerCase() == "school" &&
            studentRecord?.projectId && (
              <div>
                <p className="text-xs text-gray-500">Project Name</p>
                <Link
                  href={`${session?.data?.user?.role?.toLowerCase()}/projects/${
                    studentRecord?.projectId
                  }`}
                  className="font-medium underline hover:text-blue-500"
                >
                  {studentRecord?.projectName || "N/A"}
                </Link>
              </div>
            )}
        </div>
      </div>

      {/* contact chess information */}
      <div className="contact-chess-information flex flex-col gap-2">
        {/* Contact Information */}
        <div className="bg-gray-50 rounded-xl p-4">
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
        {/* Chess Information */}
        <div className="bg-gray-50 flex flex-col rounded-xl p-3">
          <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
            <Crown />
            <span className="ml-1">Chess Information</span>
          </p>

          {/* fide id */}
          <div className="details grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">FIDE ID</p>
              <div className="detail flex items-center">
                <IdCard className="text-gray-500" />
                <p className="font-medium ml-1">
                  {studentRecord?.fideId || "N/A"}
                </p>
              </div>
            </div>

            {/* fide id */}
            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <div className="detail flex items-center">
                <StarBorderIcon sx={{ color: "gray" }} />
                <p className="font-medium ml-1">
                  {studentRecord?.rating || "N/A"}
                </p>
              </div>
            </div>

            {/* fide id */}
            <div>
              <p className="text-xs text-gray-500">Title</p>
              <div className="detail flex items-center">
                <MilitaryTechIcon sx={{ color: "gray" }} />
                <p className="font-medium ml-1">
                  {studentRecord?.title || "N/A"}
                </p>
              </div>
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
          {/* <SupervisorAccountOutlinedIcon /> */}
          <span className="ml-0">Guardian Information</span>
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
