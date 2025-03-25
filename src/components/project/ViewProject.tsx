import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Button, Divider } from "@mui/material";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewProjectDetail = ({ projectRecord }: any) => {
  console.log(projectRecord);

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7">
      <div className="header flex items-end justify-between">
        <h1 className="text-2xl font-bold">Project Details</h1>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="space-y-4 h-full mt-4 flex flex-col overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 overflow-y-auto">
          {/* Basic Project Information */}
          <div>
            <p className="font-bold text-xs text-gray-500">Project Name:</p>
            <p>{projectRecord?.name || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Contract Type:</p>
            <p>{projectRecord?.contractType || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Status:</p>
            <p
              className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                projectRecord?.completedStatus === "Ongoing"
                  ? "bg-green-400"
                  : "bg-blue-400"
              }`}
            >
              {projectRecord?.completedStatus || "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Start Date:</p>
            <p>
              {projectRecord?.startDate
                ? dayjs(projectRecord.startDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">End Date:</p>
            <p>
              {projectRecord?.endDate
                ? dayjs(projectRecord.endDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Duration (weeks):</p>
            <p>{projectRecord?.duration || "N/A"}</p>
          </div>

          {/* Location Information */}
          <div className="">
            <p className="font-bold text-xs text-gray-500">Address:</p>
            <p>{projectRecord?.address || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">
              Contract drive link:
            </p>
            {projectRecord?.contractDriveLink ? (
              <>
                <Link
                  href={projectRecord?.contractDriveLink || ""}
                  target="_blank"
                >
                  <Button variant="contained" color="info" size="small">
                    View file
                  </Button>
                </Link>
              </>
            ) : (
              <p>N/A</p>
            )}
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">
              Contract File Link:
            </p>
            {projectRecord?.contractPaper ? (
              <Link href={projectRecord?.contractPaper || ""} target="_blank">
                <Button variant="contained" color="info" size="small">
                  View file
                </Button>
              </Link>
            ) : (
              <p>N/A</p>
            )}
          </div>

          {/* Primary Contact Information */}
          <div className="col-span-3 mt-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">
              Primary Contact
            </h3>
            <div className="grid grid-cols-3 gap-4 ">
              <div>
                <p className="font-bold text-xs text-gray-500">Name:</p>
                <p>{projectRecord?.primaryContact?.name || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">Phone:</p>
                <p>{projectRecord?.primaryContact?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">Email:</p>
                <p>{projectRecord?.primaryContact?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Assigned Trainers */}
          <div className="col-span-3 mt-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">
              Assigned Trainers
            </h3>
            {projectRecord?.assignedTrainers?.length > 0 ? (
              <div className="grid grid-cols-5 gap-3">
                {projectRecord.assignedTrainers.map((trainer, index) => (
                  <div key={index} className="border rounded p-2 bg-gray-50">
                    <div>
                      <p className="font-bold text-xs text-gray-500">Name:</p>
                      <p className="text-sm">{trainer.trainerName || "N/A"}</p>
                    </div>
                    <div className="mt-2">
                      <p className="font-bold text-xs text-gray-500">Role:</p>
                      <p className="text-sm">{trainer.trainerRole || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 pl-4">No trainers assigned</p>
            )}
          </div>

          {/* Time Slots */}
          <div className="col-span-3">
            <h3 className="font-bold text-sm text-gray-700 mb-2">Time Slots</h3>
            {projectRecord?.timeSlots?.length > 0 ? (
              <div className="grid grid-cols-5 gap-3">
                {projectRecord.timeSlots.map((slot, index) => (
                  <div key={index} className="border rounded p-2 bg-gray-50">
                    <div>
                      <p className="font-bold text-xs text-gray-500">Day:</p>
                      <p className="text-sm">{slot.day || "N/A"}</p>
                    </div>
                    <div className="mt-2">
                      <p className="font-bold text-xs text-gray-500">Time:</p>
                      <p className="text-sm">
                        {slot.fromTime || "N/A"} - {slot.toTime || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 pl-4">No time slots defined</p>
            )}
          </div>

          {/* map Location */}
          <div className="col-span-3">
            <h3 className="font-bold text-sm text-gray-700 mb-2">
              Map location
            </h3>
            {projectRecord?.mapLocation ? (
              <iframe
                src={projectRecord?.mapLocation}
                className="w-full"
                height="450"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectDetail;
