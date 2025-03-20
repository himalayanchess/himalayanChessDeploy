import React, { useState } from "react";
import { Box, Button, Modal, Paper, Avatar, Chip } from "@mui/material";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { useDispatch } from "react-redux";
import { removeLeaveRequest } from "@/redux/leaveRequestSlice";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { updateApprovedLeaveRequest } from "@/redux/leaveApprovalSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewLeaveRequest = ({
  leaveRequest,
  handleviewLeaveRequestModalClose,
  role = "trainer",
}: any) => {
  const dispatch = useDispatch<any>();
  const [deleteLeaveRequestModalOpen, setDeleteLeaveRequestModalOpen] =
    useState(false);
  const [
    confirmApproveStatusLeaveRequestModalOpen,
    setConfirmApproveStatusLeaveRequestModalOpen,
  ] = useState(false);
  const [selectedApproveStatusMode, setSelectedApproveStatusMode] =
    useState("");

  const handleDeleteLeaveRequestModalOpen = () =>
    setDeleteLeaveRequestModalOpen(true);
  const handleDeleteLeaveRequestModalClose = () =>
    setDeleteLeaveRequestModalOpen(false);

  const handleConfirmApproveStatusLeaveRequestModalOpen = (
    approveStatusMode: string
  ) => {
    setSelectedApproveStatusMode(approveStatusMode);
    setConfirmApproveStatusLeaveRequestModalOpen(true);
  };

  const handleConfirmApproveStatusLeaveRequestModalClose = () => {
    setConfirmApproveStatusLeaveRequestModalOpen(false);
  };

  const handleLeaveRequestDelete = async () => {
    try {
      const { data: resData } = await axios.post(
        "/api/leaverequest/deleteLeaveRequest",
        leaveRequest
      );
      if (resData?.statusCode === 200) {
        handleviewLeaveRequestModalClose();
        dispatch(removeLeaveRequest(leaveRequest));
      }
      notify(resData.msg, resData.statusCode);
    } catch (error) {
      console.log("Error in view assigned class (deleteClass route)");
    }
  };

  const handleApproveLeaveRequest = async () => {
    if (selectedApproveStatusMode === "") {
      notify("Invalid selected approveStatusState", 204);
      return;
    }
    const { data: resData } = await axios.post(
      "/api/leaverequest/updateLeaveRequest",
      {
        ...leaveRequest,
        approvalStatus: selectedApproveStatusMode,
        isResponded: true,
      }
    );
    if (resData?.statusCode === 200) {
      notify("Responded", 200);
      dispatch(updateApprovedLeaveRequest(resData.updatedLeaveRequest));
      handleviewLeaveRequestModalClose();
    } else {
      notify(resData?.msg, resData?.statusCode);
    }
  };

  return (
    <Box className=" bg-white rounded-lg  ">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <p className="font-bold text-2xl ">Leave Request Details</p>
        {role.toLowerCase() === "trainer" && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteLeaveRequestModalOpen}
            className="hover:bg-red-50"
          >
            Delete
          </Button>
        )}
      </Box>

      {/* Leave Details */}
      <div className="flex flex-col gap-4 ">
        <Box>
          <p className="text-gray-500 text-xs font-bold ">Issued Date</p>
          <p className="">
            {dayjs(leaveRequest?.nepaliTodaysDate)
              .tz(timeZone)
              .format("MMMM D, YYYY, dddd")}
          </p>
        </Box>

        {/* from-to */}
        <div className="from-to grid grid-cols-3">
          <Box>
            <p className="text-gray-500 text-xs font-bold">From</p>
            <p className="">
              {dayjs(leaveRequest?.fromDate)
                .tz(timeZone)
                .format("MMMM D, YYYY, dddd")}
            </p>
          </Box>

          <Box>
            <p className="text-gray-500 text-xs font-bold">To</p>
            <p className="">
              {dayjs(leaveRequest?.toDate)
                .tz(timeZone)
                .format("MMMM D, YYYY, dddd")}
            </p>
          </Box>
          <Box>
            <p className="text-gray-500 text-xs font-bold">Leave Duration</p>
            <p className="">{leaveRequest?.leaveDurationDays} day(s)</p>
          </Box>
        </div>

        {/* trainer name and approval status  */}
        <div className="from-to grid grid-cols-3">
          <Box>
            <p className="text-gray-500 text-xs font-bold">Issued Trainer</p>
            <p className="">{leaveRequest?.trainerName}</p>
          </Box>
          <Box>
            <p className="text-gray-500 text-xs font-bold">Approval Status</p>
            <p className="">{leaveRequest?.approvalStatus}</p>
          </Box>
        </div>

        <Box>
          <p className="text-gray-500 text-xs font-bold">Subject</p>
          <p className="">{leaveRequest?.leaveSubject}</p>
        </Box>

        <Box>
          <p className="text-gray-500 text-xs font-bold">Reason</p>
          <p className="">{leaveRequest?.leaveReason}</p>
        </Box>

        {leaveRequest?.affectedClasses?.length > 0 && (
          <Box>
            <p className="text-gray-500 text-xs font-bold">Affected Classes</p>
            <div className="flex-wrap">
              {leaveRequest?.affectedClasses?.map(
                (field: any, index: number) => (
                  <p
                    key={`affectedClassName-${index}`}
                    className="border border-gray-600 px-2 rounded-full py-1 w-max text-sm"
                  >
                    {field?.affectedClassName}
                  </p>
                )
              )}
            </div>
          </Box>
        )}

        {leaveRequest?.supportReasonFileUrl && (
          <Box>
            <p className="text-gray-500 text-xs font-bold">
              Support for Reason
            </p>
            <Button
              variant="outlined"
              startIcon={<InsertDriveFileIcon />}
              href={leaveRequest?.supportReasonFileUrl}
              target="_blank"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              View File
            </Button>
          </Box>
        )}
      </div>

      {/* Approve/Reject Buttons */}
      {role.toLowerCase() === "superadmin" && !leaveRequest?.isResponded && (
        <Box className="mt-8 flex gap-4">
          <Button
            variant="contained"
            color="success"
            className="bg-green-600 hover:bg-green-700"
            onClick={() =>
              handleConfirmApproveStatusLeaveRequestModalOpen("approved")
            }
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            className="bg-red-600 hover:bg-red-700"
            onClick={() =>
              handleConfirmApproveStatusLeaveRequestModalOpen("rejected")
            }
          >
            Reject
          </Button>
        </Box>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteLeaveRequestModalOpen}
        onClose={handleDeleteLeaveRequestModalClose}
      >
        <Box className="flex items-center justify-center">
          <Paper className="w-[400px] p-6 rounded-lg ">
            <p className="font-semibold mb-4 ">Confirm Delete</p>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this leave request? This action
              cannot be undone.
            </p>
            <Box className="flex justify-end gap-2">
              <Button
                variant="outlined"
                onClick={handleDeleteLeaveRequestModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleLeaveRequestDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>

      {/* Approve/Reject Confirmation Modal */}
      <Modal
        open={confirmApproveStatusLeaveRequestModalOpen}
        onClose={handleConfirmApproveStatusLeaveRequestModalClose}
      >
        <Box className="flex items-center justify-center">
          <Paper className="w-[400px] p-6 rounded-lg shadow-lg">
            <p className="font-semibold mb-4 ">Confirm Action</p>
            <p className="mb-6 text-gray-600">
              {selectedApproveStatusMode === "approved"
                ? "You are about to approve this leave request."
                : "You are about to reject this leave request."}
            </p>
            <Box className="flex justify-end gap-2">
              <Button
                variant="outlined"
                onClick={handleConfirmApproveStatusLeaveRequestModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleApproveLeaveRequest}
                className={
                  selectedApproveStatusMode === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                Confirm
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewLeaveRequest;
