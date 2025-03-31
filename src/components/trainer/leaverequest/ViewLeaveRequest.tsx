import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Paper,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { SquareX } from "lucide-react";

import ApprovalIcon from "@mui/icons-material/Approval";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { useDispatch } from "react-redux";
import { removeLeaveRequest } from "@/redux/leaveRequestSlice";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { updateApprovedLeaveRequest } from "@/redux/leaveApprovalSlice";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewLeaveRequest = ({ leaveRequestRecord, role }: any) => {
  const router = useRouter();
  const dispatch = useDispatch<any>();

  const [loaded, setLoaded] = useState(false);
  const [responseLoading, setresponseLoading] = useState(false);
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
        leaveRequestRecord
      );
      if (resData?.statusCode === 200) {
        // dispatch(removeLeaveRequest(leaveRequestRecord));
        notify(resData.msg, resData.statusCode);
        setTimeout(() => {
          const lowercaseRole = role?.toLowerCase();
          const path =
            lowercaseRole === "superadmin"
              ? `/${lowercaseRole}/leaveapproval`
              : `/${lowercaseRole}/leaverequest`;

          router.push(path);
        }, 500);
        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("Error in view assigned class (deleteClass route)");
    }
  };

  const handleApproveLeaveRequest = async () => {
    if (selectedApproveStatusMode === "") {
      notify("Invalid selected approveStatusState", 204);
      return;
    }
    setresponseLoading(true);
    const { data: resData } = await axios.post(
      "/api/leaverequest/updateLeaveRequest",
      {
        ...leaveRequestRecord,
        approvalStatus: selectedApproveStatusMode,
        isResponded: true,
      }
    );
    if (resData?.statusCode === 200) {
      // dispatch(updateApprovedLeaveRequest(resData.updatedLeaveRequest));
      notify("Responded", 200);
      setTimeout(() => {
        router.push(`/${role?.toLowerCase()}/leaveapproval`);
      }, 500);
      return;
    }
    setresponseLoading(true);
    notify(resData?.msg, resData?.statusCode);
    return;
  };

  useEffect(() => {
    if (leaveRequestRecord) {
      setLoaded(true);
    }
  }, [leaveRequestRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7">
      {/* Header */}

      <div className="header flex items-end justify-between">
        <h1 className="text-2xl font-bold">Leave Request Details</h1>

        <Box className="flex justify-between items-center ">
          <p className="font-bold text-2xl "></p>
          {(role?.toLowerCase() === "superadmin" ||
            (!leaveRequestRecord?.isResponded &&
              (role?.toLowerCase() === "trainer" ||
                role?.toLowerCase() === "admin"))) && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteLeaveRequestModalOpen}
            >
              <DeleteIcon />
              <span className="ml-1">Delete</span>
            </Button>
          )}
        </Box>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      {/* Leave Details */}
      <div className="flex flex-col gap-4 ">
        <Box>
          <p className="text-gray-500 text-xs font-bold ">Issued Date</p>
          <p className="">
            {dayjs(leaveRequestRecord?.nepaliTodaysDate)
              .tz(timeZone)
              .format("MMMM D, YYYY, dddd")}
          </p>
        </Box>

        {/* from-to */}
        <div className="from-to grid grid-cols-3">
          <Box>
            <p className="text-gray-500 text-xs font-bold">From</p>
            <p className="">
              {dayjs(leaveRequestRecord?.fromDate)
                .tz(timeZone)
                .format("MMMM D, YYYY, ddd")}
            </p>
          </Box>

          <Box>
            <p className="text-gray-500 text-xs font-bold">To</p>
            <p className="">
              {dayjs(leaveRequestRecord?.toDate)
                .tz(timeZone)
                .format("MMMM D, YYYY, ddd")}
            </p>
          </Box>
          <Box>
            <p className="text-gray-500 text-xs font-bold">Leave Duration</p>
            <p className="">{leaveRequestRecord?.leaveDurationDays} day(s)</p>
          </Box>
        </div>

        {/* user name and approval status  */}
        <div className="from-to grid grid-cols-3">
          <Box>
            <p className="text-gray-500 text-xs font-bold">Issued User</p>
            <p className="">{leaveRequestRecord?.userName}</p>
          </Box>
          <Box>
            <p className="text-gray-500 text-xs font-bold">Approval Status</p>
            <span
              className={`px-3 py-1 text-sm  text-white rounded-full ${
                leaveRequestRecord?.approvalStatus?.toLowerCase() === "pending"
                  ? "bg-gray-400"
                  : leaveRequestRecord?.approvalStatus?.toLowerCase() ===
                    "approved"
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
            >
              {leaveRequestRecord?.approvalStatus}
            </span>
          </Box>

          <Box>
            <p className="text-gray-500 text-xs font-bold">User role</p>
            <p className="">{leaveRequestRecord?.userRole} </p>
          </Box>
        </div>

        <Box>
          <p className="text-gray-500 text-xs font-bold">Subject</p>
          <p className="">{leaveRequestRecord?.leaveSubject}</p>
        </Box>

        <Box>
          <p className="text-gray-500 text-xs font-bold">Reason</p>
          <p className="">{leaveRequestRecord?.leaveReason}</p>
        </Box>

        {leaveRequestRecord?.affectedClasses?.length > 0 && (
          <Box>
            <p className="text-gray-500 text-xs font-bold">Affected Classes</p>
            <div className="flex-wrap mt-2">
              {leaveRequestRecord?.affectedClasses?.map(
                (field: any, index: number) => (
                  <p
                    key={`affectedClassName-${index}`}
                    className="border border-gray-400 px-2 rounded-full py-1 w-max text-xs"
                  >
                    {field?.affectedClassName}
                  </p>
                )
              )}
            </div>
          </Box>
        )}

        {leaveRequestRecord?.supportReasonFileUrl && (
          <Box>
            <p className="text-gray-500 text-xs font-bold">
              Support for Reason
            </p>
            <Button
              variant="outlined"
              startIcon={<InsertDriveFileIcon />}
              href={leaveRequestRecord?.supportReasonFileUrl}
              target="_blank"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              View File
            </Button>
          </Box>
        )}
      </div>

      {/* Approve/Reject Buttons */}
      {role?.toLowerCase() === "superadmin" &&
        !leaveRequestRecord?.isResponded && (
          <Box className="mt-8 flex gap-4">
            <Button
              variant="contained"
              color="success"
              className="bg-green-600 hover:bg-green-700"
              onClick={() =>
                handleConfirmApproveStatusLeaveRequestModalOpen("approved")
              }
            >
              <ApprovalIcon />
              <span className="ml-1">Approve</span>
            </Button>
            <Button
              variant="contained"
              color="error"
              className="bg-red-600 hover:bg-red-700"
              onClick={() =>
                handleConfirmApproveStatusLeaveRequestModalOpen("rejected")
              }
            >
              <SquareX />
              <span className="ml-1">Reject</span>
            </Button>
          </Box>
        )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteLeaveRequestModalOpen}
        onClose={handleDeleteLeaveRequestModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex  items-center justify-center"
      >
        <Box
          onClick={handleDeleteLeaveRequestModalClose}
          className="flex h-screen w-screen  items-center justify-center"
        >
          <Paper className="w-[400px] p-6 rounded-lg flex flex-col items-center ">
            <p className=" mb-4 text-2xl font-bold">Confirm Delete</p>
            <p className="mb-6 text-gray-600 text-center text-sm">
              Are you sure you want to delete this leave request? <br />
              This action cannot be undone.
            </p>
            <Box className="flex justify-end gap-4">
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
        className="flex items-center justify-center"
      >
        <Paper className="w-[400px] p-6 rounded-lg shadow-lg flex flex-col items-center">
          <p className="font-bold mb-4 text-2xl  ">Confirm Action</p>
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

            {responseLoading ? (
              <LoadingButton
                variant="contained"
                size="medium"
                loading={responseLoading}
                loadingPosition="start"
                sx={{ marginRight: ".5rem", paddingInline: "1.5rem" }}
                className="mt-7 w-max"
              >
                Responding
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                color={`${
                  selectedApproveStatusMode == "approved" ? "success" : "error"
                }`}
                onClick={handleApproveLeaveRequest}
                className={
                  selectedApproveStatusMode === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {`${
                  selectedApproveStatusMode == "approved" ? "Approve" : "Reject"
                }`}
              </Button>
            )}
          </Box>
        </Paper>
      </Modal>
    </div>
  );
};

export default ViewLeaveRequest;
