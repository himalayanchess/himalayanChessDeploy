import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Box, Modal } from "@mui/material";
import ViewLeaveRequest from "./ViewLeaveRequest";
import { useSession } from "next-auth/react";
import { fetchAllTrainersLeaveRequests } from "@/redux/leaveRequestSlice";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const TrainersLeaveRequestList = ({ role }: any) => {
  const dispatch = useDispatch<any>();
  // selector
  const { allTrainersLeaveRequests } = useSelector(
    (state: any) => state.leaveRequestReducer
  );
  const [selectedLeaveRequest, setselectedLeaveRequest] = useState(null);

  const [viewLeaveRequestModalOpen, setviewLeaveRequestModalOpen] =
    useState(false);
  // session for trainer data
  const session = useSession();

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

  // initial data fetch
  useEffect(() => {
    if (session?.data?.user?._id) {
      // Fetch today's classes and all students only when session is available
      dispatch(
        fetchAllTrainersLeaveRequests({
          userId: session?.data?.user?._id,
        })
      );
    }
  }, [session]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <p className="text-xl font-bold">Leave History</p>

      <div className="leaveHistoryList mt-4 h-full flex flex-col gap-2 overflow-y-auto">
        {allTrainersLeaveRequests?.length == 0 ? (
          <p className="text-gray-500 text-sm">No leave requests yet</p>
        ) : (
          allTrainersLeaveRequests?.map((leaveRequest: any) => (
            <Link
              key={leaveRequest?._id}
              href={`/${role?.toLowerCase()}/leaverequest/${leaveRequest?._id}`}
              // onClick={() => handleviewLeaveRequestModalOpen(leaveRequest)}
              className="singleLeaveHistory bg-gray-100 cursor-pointer py-3 px-4 rounded-md hover:bg-gray-200 transition-all ease duration-150"
            >
              <div className="date-approvalstatus flex justify-between items-center">
                {/* date */}
                <p className="date text-xs text-gray-500">
                  {dayjs(leaveRequest?.nepaliDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY, ddd")}
                </p>
                {/* approval status */}
                <p
                  className={`px-3 py-1 text-xs  text-white rounded-full ${
                    leaveRequest?.approvalStatus?.toLowerCase() === "pending"
                      ? "bg-gray-400"
                      : leaveRequest?.approvalStatus?.toLowerCase() ===
                        "approved"
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                >
                  {leaveRequest?.approvalStatus}
                </p>
              </div>
              <p className="font-bold text-sm">{leaveRequest?.leaveSubject}</p>
              <p className="text-xs text-gray-500">
                Duration: {leaveRequest?.leaveDurationDays || 0} day(s)
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainersLeaveRequestList;
