import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

const timeZone = "Asia/Kathmandu";

const BasicStudentInfo = ({ studentRecord }: any) => {
  return (
    <div>
      <div className="flex-1 mt-3  mr-7 grid grid-cols-3 gap-5 overflow-y-auto h-max">
        <div>
          <p className="font-bold text-xs text-gray-500">Name:</p>
          <p>{studentRecord?.name}</p>
        </div>
        <div>
          <p className="font-bold text-xs text-gray-500">Affiliated To:</p>
          <p>{studentRecord?.affiliatedTo}</p>
        </div>
        <div>
          <p className="font-bold text-xs text-gray-500">Date of Birth:</p>
          <p>{dayjs(studentRecord?.dob).tz(timeZone).format("MMMM D, YYYY")}</p>
        </div>
        <div>
          <p className="font-bold text-xs text-gray-500">Gender:</p>
          <p>{studentRecord?.gender}</p>
        </div>
        <div>
          <p className="font-bold text-xs text-gray-500">Joined Date:</p>
          <p>
            {studentRecord?.joinedDate
              ? dayjs(studentRecord?.joinedDate)
                  .tz(timeZone)
                  .format("MMMM D, YYYY")
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="font-bold text-xs text-gray-500">End Date:</p>
          <p>
            {studentRecord?.endDate
              ? dayjs(studentRecord?.endDate)
                  .tz(timeZone)
                  .format("MMMM D, YYYY")
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="font-bold text-xs text-gray-500">Phone:</p>
          <p>{studentRecord?.phone}</p>
        </div>
        <div>
          <p className="font-bold text-xs text-gray-500">Address:</p>
          <p>{studentRecord?.address}</p>
        </div>

        {/* emergency contact */}
        <div className="emergencycontact col-span-3">
          <p className="font-bold mb-2">Emergency Details</p>
          <div className="details grid grid-cols-3">
            <div>
              <p className="font-bold text-xs text-gray-500">
                Emergency Contact:
              </p>
              <p>{studentRecord?.emergencyContactName}</p>
            </div>
            <div>
              <p className="font-bold text-xs text-gray-500">
                Emergency Contact:
              </p>
              <p>{studentRecord?.emergencyContactNo}</p>
            </div>
          </div>
        </div>

        {/* chess info */}
        <div className="chessinfo col-span-3">
          <p className="font-bold mb-2">Guardian Information</p>
          <div className="details grid grid-cols-3">
            <div>
              <p className="font-bold text-xs text-gray-500">Guardian name:</p>
              <p>{studentRecord?.guardianInfo?.name || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold text-xs text-gray-500">Guardian phone:</p>
              <p>{studentRecord?.guardianInfo?.phone || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold text-xs text-gray-500">Guardian email:</p>
              <p>{studentRecord?.guardianInfo?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Guardian info */}
        <div className="chessinfo col-span-3">
          <p className="font-bold mb-2">Chess Information</p>
          <div className="details grid grid-cols-3">
            <div>
              <p className="font-bold text-xs text-gray-500">Title:</p>
              <p>{studentRecord?.title || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold text-xs text-gray-500">FIDE ID:</p>
              <p>{studentRecord?.fideId || "N/A"}</p>
            </div>
            <div>
              <p className="font-bold text-xs text-gray-500">Rating:</p>
              <p>{studentRecord?.rating}</p>
            </div>
          </div>
        </div>

        {/* cv if trainer */}
        {studentRecord?.role?.toLowerCase() == "trainer" && (
          <div>
            <p className="font-bold text-xs text-gray-500">Trainers CV:</p>
            <Link
              href={studentRecord?.trainerCvUrl}
              target="_blank"
              title="View CV"
            >
              <Button variant="outlined">View CV</Button>
            </Link>
          </div>
        )}

        {/* active status */}
        <div>
          <p className="font-bold text-xs text-gray-500">Active Status:</p>
          <p
            className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
              studentRecord?.activeStatus ? "bg-green-400" : "bg-red-400"
            }`}
          >
            {studentRecord?.activeStatus ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicStudentInfo;
