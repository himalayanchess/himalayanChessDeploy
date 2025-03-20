import React, { useState } from "react";
import { useSelector } from "react-redux";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import ViewLeaveRequest from "@/components/trainer/leaverequest/ViewLeaveRequest";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Box, Button, Modal } from "@mui/material";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const LeaveApprovalList = ({
  selectedApprovalStatus,
  allFilteredLeaveRequests,
  currentPage,
  leaveRequestsPerPage,
}: any) => {
  // use selector
  const { allLeaveRequestsLoading } = useSelector(
    (state: any) => state.leaveApprovalReducer
  );

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

  // console.log("status inside leavae list", selectedApprovalStatus);

  // Close modal
  const handleviewLeaveRequestModalClose = () => {
    setselectedLeaveRequest(null);
    setviewLeaveRequestModalOpen(false);
  };

  return (
    <div className="overflow-y-auto  mt-3 flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings sticky top-0 z-10 mb-2 grid grid-cols-6 w-full bg-gray-100">
        <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
          Name
        </span>
        <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
          Date
        </span>
        <span className="py-3 px-5 col-span-2 text-left text-sm font-medium text-gray-600">
          Subject
        </span>

        <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
          Approval Status
        </span>
        <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
          Actions
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
      <div className="leaveRequestList flex-1 grid grid-rows-7 ">
        {allFilteredLeaveRequests
          ?.slice(
            (currentPage - 1) * leaveRequestsPerPage,
            currentPage * leaveRequestsPerPage
          )
          ?.map((leaveRequest: any) => {
            return (
              <div key={leaveRequest?._id} className="grid grid-cols-6  w-full">
                <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
                  {leaveRequest?.trainerName}
                </span>
                <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
                  {dayjs(leaveRequest?.nepaliDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY")}
                </span>
                <span className="py-3 px-5 col-span-2 text-left text-sm font-medium text-gray-600">
                  {leaveRequest?.leaveSubject}
                </span>

                <span
                  className={`py-3 px-5 text-left text-sm font-medium text-gray-600 $`}
                >
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-white font-semibold ${
                      leaveRequest?.approvalStatus?.toLowerCase() === "pending"
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
                <div className=" text-left text-sm font-medium text-gray-600">
                  <Button
                    onClick={() =>
                      handleviewLeaveRequestModalOpen(leaveRequest)
                    }
                    className=""
                    title="Review"
                    color="inherit"
                    size="small"
                  >
                    <RateReviewIcon />
                  </Button>
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
                    <Box className="w-[55%] max-h-[90%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                      <ViewLeaveRequest
                        leaveRequest={selectedLeaveRequest}
                        handleviewLeaveRequestModalClose={
                          handleviewLeaveRequestModalClose
                        }
                        // role for approval and view
                        role="superadmin"
                      />
                    </Box>
                  </Modal>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default LeaveApprovalList;
