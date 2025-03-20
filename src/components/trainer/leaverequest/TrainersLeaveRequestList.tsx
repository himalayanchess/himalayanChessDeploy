import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Box, Modal } from "@mui/material";
import ViewLeaveRequest from "./ViewLeaveRequest";
import { useSession } from "next-auth/react";
import { fetchAllTrainersLeaveRequests } from "@/redux/leaveRequestSlice";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const TrainersLeaveRequestList = () => {
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
          trainerId: session.data.user._id,
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
            <div key={leaveRequest?._id}>
              <div
                onClick={() => handleviewLeaveRequestModalOpen(leaveRequest)}
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
                  <p className="approvalStatus text-xs bg-red-400 text-white px-2 py-0.5 rounded-full">
                    {leaveRequest?.approvalStatus}
                  </p>
                </div>
                <p className="font-bold text-sm">
                  {leaveRequest?.leaveSubject}
                </p>
                <p className="text-xs text-gray-500">
                  Duration: {leaveRequest?.leaveDurationDays || 0} day(s)
                </p>
              </div>

              {/* Modal */}
              <Modal
                open={
                  viewLeaveRequestModalOpen &&
                  selectedLeaveRequest?._id === leaveRequest?._id
                } // Ensure modal is only open for the selected class
                onClose={handleviewLeaveRequestModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center "
              >
                <Box className="w-[40%] max-h-[90%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                  <ViewLeaveRequest
                    leaveRequest={selectedLeaveRequest}
                    handleviewLeaveRequestModalClose={
                      handleviewLeaveRequestModalClose
                    }
                  />
                </Box>
              </Modal>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainersLeaveRequestList;
