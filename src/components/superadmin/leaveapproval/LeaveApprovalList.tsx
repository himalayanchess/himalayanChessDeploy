import React, { useState } from "react";
import { useSelector } from "react-redux";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CircularProgress from "@mui/material/CircularProgress";
import ViewLeaveRequest from "@/components/trainer/leaverequest/ViewLeaveRequest";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Box, Button, Modal } from "@mui/material";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const LeaveApprovalList = ({
  allFilteredLeaveRequests,
  currentPage,
  leaveRequestsPerPage,
  allLeaveRequestsLoading,
}: any) => {
  //state vars
  const [selectedLeaveRequest, setselectedLeaveRequest] = useState(null);

  // modal state
  const [viewLeaveRequestModalOpen, setviewLeaveRequestModalOpen] =
    useState(false);

  //open modal and set selected leave request
  const handleviewLeaveRequestModalOpen = (leaveRequest: any) => {
    setselectedLeaveRequest(leaveRequest);
    setviewLeaveRequestModalOpen(true);
  };

  // Close modal
  const handleviewLeaveRequestModalClose = () => {
    setselectedLeaveRequest(null);
    setviewLeaveRequestModalOpen(false);
  };

  return (
    <div className="overflow-y-auto mt-2 border  flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(6,1fr)] w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
          Subject
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Date
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Name
        </span>{" "}
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Duration
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Approval Status
        </span>
      </div>

      {/* loading */}
      {allLeaveRequestsLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting leave requests</p>
        </div>
      )}
      {/* No Student Found */}
      {allFilteredLeaveRequests.length === 0 && !allLeaveRequestsLoading && (
        <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No leave requests found</p>
        </div>
      )}

      {/* leave request list */}
      {!allLeaveRequestsLoading && (
        <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredLeaveRequests
            ?.slice(
              (currentPage - 1) * leaveRequestsPerPage,
              currentPage * leaveRequestsPerPage
            )
            ?.map((leaveRequest: any, index: any) => {
              const serialNumber =
                (currentPage - 1) * leaveRequestsPerPage + index + 1;
              return (
                <div
                  key={leaveRequest?._id}
                  className="grid grid-cols-[70px,repeat(6,1fr)] border-b  border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                >
                  <span className="text-center text-sm font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  <Link
                    href={`leaverequest/${leaveRequest?._id}`}
                    className="col-span-2 text-left text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                  >
                    {leaveRequest?.leaveSubject}
                  </Link>
                  <span className="text-left text-sm font-medium text-gray-600">
                    {dayjs(leaveRequest?.nepaliDate)
                      .tz(timeZone)
                      .format("MMMM D, YYYY")}
                  </span>
                  <span className="text-left text-sm font-medium text-gray-600">
                    {leaveRequest?.userName}
                  </span>
                  <span className="text-left text-sm font-medium text-gray-600">
                    {leaveRequest?.leaveDurationDays} day(s)
                  </span>
                  <span
                    className={`text-left text-sm font-medium text-gray-600 $`}
                  >
                    <span
                      className={`px-3 py-1 text-xs rounded-full text-white font-semibold ${
                        leaveRequest?.approvalStatus?.toLowerCase() ===
                        "pending"
                          ? "bg-gray-400"
                          : leaveRequest?.approvalStatus?.toLowerCase() ===
                            "approved"
                          ? "bg-green-400"
                          : leaveRequest?.approvalStatus?.toLowerCase() ===
                            "rejected"
                          ? "bg-red-400"
                          : ""
                      }`}
                    >
                      {leaveRequest?.approvalStatus}
                    </span>
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default LeaveApprovalList;
