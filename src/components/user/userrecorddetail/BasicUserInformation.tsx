import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

import { ReceiptText, MapPinHouse, Contact, Crown, IdCard } from "lucide-react";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicUserInformation = ({ userRecord }: any) => {
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
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Name</p>
            <div className="name-role flex justify-between items-start">
              {/* name */}
              <div className="detail flex items-center">
                <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
                <p className="font-bold ml-1 text-xl">
                  {userRecord?.name || "N/A"}
                </p>
              </div>
              {/* role */}
              <p className="role text-sm bg-gray-200 rounded-full text-gray-600 font-bold px-3 py-0.5">
                {userRecord?.role || "N/A"}
              </p>
            </div>
            <div className="detail flex items-center">
              <MailOutlineIcon sx={{ color: "gray " }} />
              <p className="ml-1 text-md text-gray-500">
                {userRecord?.email || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500">Gender</p>
            <div className="detail flex items-center">
              {userRecord?.gender?.toLowerCase() === "female" ? (
                <FemaleIcon sx={{ color: "gray " }} />
              ) : (
                <MaleIcon sx={{ color: "gray " }} />
              )}
              <p className="font-medium ml-1">{userRecord?.gender || "N/A"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date of Birth</p>
            <div className="detail flex items-center">
              <EventOutlinedIcon sx={{ color: "gray " }} />
              <p className="font-medium ml-1">
                {userRecord?.dob ? formatDate(userRecord?.dob) : "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500">Joined Date</p>
            <p className="font-medium">
              {userRecord?.joinedDate
                ? formatDate(userRecord?.joinedDate)
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">End Date</p>
            <p className="font-medium">
              {userRecord?.endDate ? formatDate(userRecord?.endDate) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="contact-chess-information flex flex-col gap-2">
        {/* Contact Information */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <div className="detail flex items-center">
                <CallOutlinedIcon sx={{ color: "gray" }} />
                <p className="font-medium ml-1">{userRecord?.phone || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <div className="detail flex items-center">
                <MapPinHouse className="text-gray-500" />
                <p className="font-medium ml-1 text-sm">
                  {userRecord?.address || "N/A"}
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
                  {userRecord?.fideId || "N/A"}
                </p>
              </div>
            </div>

            {/* fide id */}
            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <div className="detail flex items-center">
                <StarBorderIcon sx={{ color: "gray" }} />
                <p className="font-medium ml-1">
                  {userRecord?.rating || "N/A"}
                </p>
              </div>
            </div>

            {/* fide id */}
            <div>
              <p className="text-xs text-gray-500">Title</p>
              <div className="detail flex items-center">
                <MilitaryTechIcon sx={{ color: "gray" }} />
                <p className="font-medium ml-1">{userRecord?.title || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gray-50 rounded-xl p-4 col-span-1  ">
        <p className="text-sm text-gray-500 mb-2 font-bold">
          {/* <ContactPhoneOutlinedIcon /> */}
          <span className="ml-0">Emergency Contact</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-medium flex items-center">
              <PersonOutlineOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {userRecord?.emergencyContactName || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium flex items-center">
              <CallOutlinedIcon sx={{ color: "gray " }} />
              <span className="ml-1">
                {userRecord?.emergencyContactNo || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* other info */}
      {userRecord?.role?.toLowerCase() == "trainer" && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
            {/* <Crown /> */}
            <span className="ml-0">Other Information</span>
          </p>

          {/* CV */}
          <div className="details grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Trainers CV</p>
              <div className="detail flex items-center">
                <ArticleOutlinedIcon className="text-gray-500" />
                {userRecord?.trainerCvUrl ? (
                  <Link
                    href={userRecord?.trainerCvUrl}
                    className="font-medium ml-1 underline hover:text-blue-500"
                  >
                    View CV
                  </Link>
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicUserInformation;
