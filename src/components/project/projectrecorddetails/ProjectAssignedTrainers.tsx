import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);
const timeZone = "Asia/Kathmandu";

const ProjectAssignedTrainers = ({ projectRecord }: any) => {
  const session = useSession();
  // state vars
  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    if (projectRecord) {
      setloaded(true);
    }
  }, [projectRecord]);

  if (!loaded) return <div></div>;

  return (
    <div className="flex-1  overflow-y-auto h-max ">
      {/* Assigned Trainers */}

      <h3 className="font-bold text-sm text-gray-500 mb-2">
        Assigned Trainers
      </h3>

      {projectRecord?.assignedTrainers?.length == 0 ? (
        <p className="text-gray-500">No assigned trainers</p>
      ) : (
        <div className="overflow-y-auto w-full mt-2 border  flex-1 flex flex-col bg-white rounded-lg">
          {/* Table Headings */}
          <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
            <span className="py-3 text-center text-sm font-bold text-gray-600">
              SN
            </span>
            <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
              Project Name
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              Start Date
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              End Date
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              Role
            </span>
          </div>

          {/* assigned trainers List */}

          <div className="table-contents flex-1 grid grid-cols-1 ">
            {projectRecord.assignedTrainers?.map(
              (assignedTrainer: any, index: any) => {
                // serial number
                return (
                  <div
                    key={assignedTrainer?.trainerId}
                    className="grid grid-cols-[70px,repeat(5,1fr)] border-b  border-gray-200 py-3 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                  >
                    <span className="text-sm text-center font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <Link
                      title="View"
                      href={`/${session?.data?.user?.role?.toLowerCase()}/users/${
                        assignedTrainer?.trainerId
                      }`}
                      className="text-left col-span-2 text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                    >
                      {assignedTrainer?.trainerName || "N/A "}
                    </Link>
                    <span className="text-sm text-gray-700">
                      {assignedTrainer?.startDate
                        ? dayjs(assignedTrainer?.startDate)
                            .tz(timeZone)
                            .format("MMMM D, YYYY")
                        : "N/A"}
                    </span>
                    <span className="text-sm text-gray-700">
                      {assignedTrainer?.endDate
                        ? dayjs(assignedTrainer?.endDate)
                            .tz(timeZone)
                            .format("MMMM D, YYYY")
                        : "N/A"}{" "}
                    </span>
                    <span className="text-sm text-gray-500">
                      {assignedTrainer?.trainerRole || "N/A "}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAssignedTrainers;
