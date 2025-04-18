import React, { useState } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CircularProgress from "@mui/material/CircularProgress";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import { Box, Button, Modal } from "@mui/material";
import ViewActivityRecordDetail from "../../activityrecord/ViewActivityRecordDetail";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const TrainerHistoryList = ({
  loading,
  filteredTrainersActivityRecords,
  activityRecordsPerPage,
  currentPage,
}: any) => {
  const [selectedActivityRecord, setSelectedActivityRecord] =
    useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Handle view modal open
  const handleViewModalOpen = (activityRecord: any) => {
    setSelectedActivityRecord(activityRecord);
    setViewModalOpen(true);
  };

  // Handle view modal close
  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  return (
    <div className="overflow-y-auto mt-2 border  flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Date
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Batch Name
        </span>
        <span className="py-3  col-span-2 text-left text-sm font-bold text-gray-600">
          Study Topic
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Attendance
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting records</p>
        </div>
      )}

      {/* No Records Found */}
      {filteredTrainersActivityRecords.length === 0 && !loading && (
        <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No records found</p>
        </div>
      )}

      {/* List of Records */}
      <div className="record-list flex-1 grid grid-rows-7 ">
        {!loading &&
          filteredTrainersActivityRecords
            ?.slice(
              (currentPage - 1) * activityRecordsPerPage,
              currentPage * activityRecordsPerPage
            )
            ?.map((activityRecord: any, index: any) => {
              // serial number
              const serialNumber =
                (currentPage - 1) * activityRecordsPerPage + index + 1;

              // all uniqe topic for that day
              const uniqueTopics = new Set<string>();

              activityRecord.studentRecords?.forEach((student: any) => {
                student.studyTopics?.forEach((topic: string) => {
                  uniqueTopics.add(topic);
                });
              });
              return (
                <Link
                  href={`/trainer/trainerhistory/${activityRecord?._id}`}
                  key={activityRecord?._id}
                  className={`grid grid-cols-[70px,repeat(5,1fr)] border-b border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 ${
                    activityRecord?.isPlayDay
                      ? "bg-green-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm text-center font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  <span className=" text-left text-sm font-medium text-gray-600">
                    {dayjs(activityRecord?.nepaliDate)
                      .tz(timeZone)
                      .format("MMMM D, YYYY, ddd")}
                  </span>
                  <span className=" text-left text-sm font-medium text-gray-600">
                    {activityRecord?.batchName}
                  </span>
                  {/* all unique topics */}
                  <div className=" flex gap-1 flex-wrap col-span-2 text-left text-xs font-medium text-gray-600">
                    {[...uniqueTopics]?.map((topic: any, index: any) => {
                      return (
                        <p
                          key={"studytopic" + index}
                          className="border border-gray-300 rounded-full px-2 py-0.5"
                        >
                          {topic}
                        </p>
                      );
                    })}
                  </div>
                  <span className=" text-left text-sm font-medium text-gray-600">
                    <span
                      className={`text-xs text-white font-bold rounded-full px-2 py-1 ${
                        activityRecord?.userPresentStatus?.toLowerCase() ===
                        "present"
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    >
                      {activityRecord?.userPresentStatus}
                    </span>
                  </span>
                </Link>
              );
            })}
      </div>

      {/* Modal for Viewing Activity Record Details */}
      <Modal
        open={viewModalOpen}
        onClose={handleViewModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center"
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <Box className="w-[60%] max-h-[90%] py-6 px-10 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
          <ViewActivityRecordDetail
            activityRecord={selectedActivityRecord}
            handleViewModalClose={handleViewModalClose}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default TrainerHistoryList;
