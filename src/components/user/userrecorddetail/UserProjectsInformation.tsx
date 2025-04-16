import { fetchAllProjects } from "@/redux/allListSlice";
import { fetchAllTrainersActivityRecords } from "@/redux/trainerHistorySlice";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CircularProgress from "@mui/material/CircularProgress";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);
const timeZone = "Asia/Kathmandu";

const UserProjectsInformation = ({
  userRecord,
  allActiveProjects,
  allProjectsLoading,
}: any) => {
  const dispatch = useDispatch<any>();

  const session = useSession();
  const [trainerProjects, setTrainerProjects] = useState([]);

  // filter projects assigned to this trainer
  useEffect(() => {
    if (
      allActiveProjects &&
      userRecord &&
      userRecord?.role?.toLowerCase() === "trainer"
    ) {
      const filteredProjects = allActiveProjects
        .filter((project: any) =>
          project.assignedTrainers.some(
            (trainer: any) => trainer.trainerId === userRecord?._id
          )
        )
        .map((project: any) => {
          const matchedTrainer = project.assignedTrainers.find(
            (trainer: any) => trainer.trainerId === userRecord?._id
          );
          return {
            projectId: project._id,
            projectName: project.name,
            startDate: matchedTrainer?.startDate || null,
            endDate: matchedTrainer?.endDate || null,
            trainerRole: matchedTrainer?.trainerRole || null,
          };
        });
      setTrainerProjects(filteredProjects);
    }
  }, [allActiveProjects, userRecord]);

  return (
    <div className="flex-1 mt-0 mr-7  overflow-y-auto h-max">
      {userRecord?.role?.toLowerCase() === "trainer" && (
        <div className="col-span-3 bg-white rounded-md shadow-md">
          <h2 className="text-md font-bold text-gray-500 mb-1">
            Assigned Projects
          </h2>

          {trainerProjects?.length === 0 && !allProjectsLoading ? (
            <p className="text-gray-500">No assigned projects</p>
          ) : (
            <div className="overflow-y-auto mt-2 border  flex-1 flex flex-col bg-white rounded-lg">
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

              {/* loading */}
              {allProjectsLoading && (
                <div className="w-full text-center my-6">
                  <CircularProgress sx={{ color: "gray" }} />
                  <p className="text-gray-500">Getting projects</p>
                </div>
              )}
              {/* No Users Found */}
              {trainerProjects.length === 0 && !allProjectsLoading && (
                <div className="flex items-center text-gray-500 w-max mx-auto my-3">
                  <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
                  <p className="text-md">No projects Found</p>
                </div>
              )}

              {/* Projects List */}
              {!allProjectsLoading && (
                <div className="table-contents flex-1 grid grid-cols-1 ">
                  {trainerProjects.map((project: any, index: any) => {
                    // serial number
                    return (
                      <div
                        key={project?.projectId}
                        className="grid grid-cols-[70px,repeat(5,1fr)] border-b  border-gray-200 py-3 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                      >
                        <span className="text-sm text-center font-medium text-gray-600">
                          {index + 1}
                        </span>
                        <Link
                          title="View"
                          href={`/${session?.data?.user?.role?.toLowerCase()}/projects/${
                            project?.projectId
                          }`}
                          className="text-left col-span-2 text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                        >
                          {project?.projectName || "N/A "}
                        </Link>
                        <span className="text-sm text-gray-700">
                          {project?.startDate
                            ? dayjs(project?.startDate)
                                .tz(timeZone)
                                .format("MMMM D, YYYY")
                            : "N/A"}
                        </span>
                        <span className="text-sm text-gray-700">
                          {project?.endDate
                            ? dayjs(project?.endDate)
                                .tz(timeZone)
                                .format("MMMM D, YYYY")
                            : "N/A"}{" "}
                        </span>
                        <span className="text-sm text-gray-500">
                          {project?.trainerRole || "N/A "}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProjectsInformation;
