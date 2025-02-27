import React from "react";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ShareIcon from "@mui/icons-material/Share";
import Link from "next/link";
const ViewProject = ({ project }) => {
  return (
    <>
      {/* first */}
      <div className="first col-span-2">
        <p className="bg-gray-400 text-white w-max text-xs py-1 px-4 font-bold  rounded-full">
          {project?.contractType}
        </p>
        <h1 className="text-3xl font-bold mb-2">{project?.name}</h1>
      </div>
      {/* second */}
      <div className="second">
        {/* start date */}
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Start Date:</span>
          <span>{project?.startDate}</span>
        </p>
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Duration:</span>
          <span>{project?.duration} (Weeks)</span>
        </p>
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Address:</span>
          <span>{project?.address} </span>
        </p>
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Status:</span>
          <span>{project?.completedStatus} </span>
        </p>
      </div>
      {/* third */}
      <div className="third contactDetails">
        {project?.contractType != "Academy" && (
          <>
            <p className="grid grid-cols-2 text-gray-500">
              <span className="font-bold mr-auto">Contact Name:</span>
              <span>{project?.primaryContact?.name} </span>
            </p>
            <p className="grid grid-cols-2 text-gray-500">
              <span className="font-bold mr-auto">Contact Phone:</span>
              <span>{project?.primaryContact?.phone} </span>
            </p>
            <p className="grid grid-cols-2 text-gray-500">
              <span className="font-bold mr-auto">Contact Email:</span>
              <span>{project?.primaryContact?.email} </span>
            </p>
          </>
        )}
      </div>
      {/* fourth */}
      <div className="third contactDetails col-span-2">
        <h1 className="font-bold text-gray-500">Assigned Trainers</h1>
        {project?.assignedTrainers.length == 0 ? (
          <p>No Assigned Trainers</p>
        ) : (
          project?.assignedTrainers?.map((trainer, i) => {
            return (
              <div key={`assignedTrainer${i}`} className="text-gray-500">
                <span>
                  {trainer.trainerName} ({trainer.trainerRole})
                </span>
              </div>
            );
          })
        )}
      </div>
      {/* fifth */}
      <div className="third contactDetails ">
        <h1 className="font-bold text-gray-500">Time Slots</h1>
        {project?.timeSlots.length == 0 ? (
          <p>No Time Slots</p>
        ) : (
          project?.timeSlots?.map((timeSlot, i) => {
            return (
              <div key={`assignedTrainer${i}`} className="text-gray-500 ">
                <span className="mr-2">{timeSlot.day}</span>
                <span>
                  ({timeSlot.fromTime} to {timeSlot.toTime})
                </span>
              </div>
            );
          })
        )}
      </div>
      {/* contract info */}
      <div className="contractInfo col-span-2 font-bold text-gray-500">
        Contract Info
      </div>
      <div className="contract-file-link flex">
        {/* pdf file */}
        {project.contractPaper && (
          <Link
            href={project.contractPaper}
            className="pdfFile flex items-center py-2 px-3 mr-4 w-max text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
          >
            <FileCopyIcon sx={{ fontSize: "1.7rem" }} />
            <span className="ml-2 text-sm">PDF file</span>
          </Link>
        )}
        {/* drive link */}
        {project.contractDriveLink && (
          <div className="pdfFile flex items-center py-2 px-3 w-max text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600">
            <ShareIcon sx={{ fontSize: "1.7rem" }} />
            <span className="ml-2 text-sm">Drive Link</span>
          </div>
        )}
        {/* no contract info */}
        {!project.contractPaper && !project.contractDriveLink && (
          <p>No contract info</p>
        )}
      </div>
      {/* map */}
      {project?.contractType != "Academy" && (
        <div className="map col-span-2">
          <h1 className="font-bold text-gray-500 mb-3">Location</h1>

          <iframe
            className=" w-full h-96"
            src={project?.location}
            // style="border:0;"
            allowFullScreen={true}
            loading="lazy"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default ViewProject;
