import { fetchAllProjects } from "@/redux/allListSlice";
import { fetchAllTrainersActivityRecords } from "@/redux/trainerHistorySlice";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserProjectsInformation = ({ userRecord }: any) => {
  const dispatch = useDispatch<any>();

  const { allActiveProjects } = useSelector(
    (state: any) => state.allListReducer
  );

  const session = useSession();

  const [trainerProjects, setTrainerProjects] = useState([]);
  // filter projects assigned to this trainer
  useEffect(() => {
    if (
      allActiveProjects &&
      userRecord &&
      userRecord?.role?.toLowerCase() === "trainer"
    ) {
      // Filter projects where this trainer is assigned
      const filteredProjects = allActiveProjects
        .filter((project: any) =>
          project.assignedTrainers.some(
            (trainer: any) => trainer.trainerId === userRecord?._id
          )
        )
        .map((project: any) => {
          // Find the matched trainer
          const matchedTrainer = project.assignedTrainers.find(
            (trainer: any) => trainer.trainerId === userRecord?._id
          );

          return {
            projectId: project._id,
            projectName: project.name,
            trainerRole: matchedTrainer?.trainerRole || "N/A", // Handle cases where trainerRole might be missing
          };
        });
      console.log("filterd projects", filteredProjects);

      setTrainerProjects(filteredProjects);
    }
  }, [allActiveProjects, userRecord]);

  // get initial all trainer activity records and projectlist (active)
  useEffect(() => {
    if (userRecord) {
      dispatch(fetchAllTrainersActivityRecords({ trainerId: userRecord?._id }));
      dispatch(fetchAllProjects());
    }
  }, [userRecord]);

  return (
    <div className="flex-1 mt-3 mr-7 grid grid-cols-3 gap-5 overflow-y-auto h-max">
      {userRecord?.role?.toLowerCase() === "trainer" && (
        <div className="col-span-3">
          <p className="font-bold text-xs text-gray-500">Assigned Projects</p>
          {trainerProjects?.length === 0 ? (
            <p>No assigned projects</p>
          ) : (
            <div className="assignedprojects mt-2 grid grid-cols-3 gap-5">
              {trainerProjects?.map((trainerProject: any) => (
                <Link
                  href={`/${session?.data?.user?.role?.toLowerCase()}/projects/${
                    trainerProject?.projectId
                  }`}
                  key={trainerProject?.projectId}
                  className="trainer-project border bg-blue-50 p-3 rounded-md transition-all ease duration-150 hover:bg-blue-100"
                >
                  <p className="text-md hover:underline hover:text-blue-600">
                    {trainerProject?.projectName}
                  </p>
                  <p className="text-xs">Role: {trainerProject?.trainerRole}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProjectsInformation;
