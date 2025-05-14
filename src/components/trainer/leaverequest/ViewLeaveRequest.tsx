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
import HistoryIcon from "@mui/icons-material/History";

import DeleteIcon from "@mui/icons-material/Delete";
import { SquareX, Luggage, MapPinHouse, File } from "lucide-react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { User, Calendar } from "lucide-react";

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
import { useSession } from "next-auth/react";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewLeaveRequest = ({ leaveRequestRecord, role }: any) => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

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

  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMM D, YYYY");
  };

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
    } catch (error) {}
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
        updateType: "updatedbysuperadmin",
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
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      {/* Header */}

      <div className="header flex items-end justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Luggage />
          <span className="ml-2">Leave Request Details</span>
        </h1>

        <div className="buttons flex gap-4">
          {/* home button */}
          <Link
            href={`/${session?.data?.user?.role?.toLowerCase()}/${
              session?.data?.user?.role?.toLowerCase() === "trainer"
                ? "leaverequest"
                : "leaveapproval"
            }`}
          >
            <Button
              className="homebutton"
              color="inherit"
              sx={{ color: "gray" }}
            >
              <HomeOutlinedIcon />
              <span className="ml-1">Home</span>
            </Button>
          </Link>

          {/* delete button */}
          <Box className="flex justify-between items-center">
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteLeaveRequestModalOpen}
              disabled={
                role?.toLowerCase() != "superadmin" ||
                (leaveRequestRecord?.isResponded &&
                  (session?.data?.user?.role?.toLowerCase() != "trainer" ||
                    role?.toLowerCase() != "admin"))
              }
            >
              <DeleteIcon />
              <span className="ml-1">Delete</span>
            </Button>
          </Box>
        </div>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="grid grid-cols-2 auto-rows-max w-full gap-3 flex-1 h-hull overflow-y-auto ">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Name</p>
              <div className="name-role flex justify-between items-start">
                {/* user name */}
                <div className="detail flex items-center">
                  <User className="text-gray-500" />
                  <p className="font-bold ml-1 text-xl">
                    {leaveRequestRecord?.userName || "N/A"}
                  </p>
                </div>
                {/* role */}
                <p className="role text-sm bg-gray-200 rounded-full text-gray-600 font-bold px-3 py-0.5">
                  {leaveRequestRecord?.userRole || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Issued date</p>
              <div className="detail flex items-center">
                <Calendar className="text-gray-500" />
                <p className="font-medium ml-1">
                  {leaveRequestRecord?.utcDate
                    ? formatDate(leaveRequestRecord?.utcDate)
                    : "N/A"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Branch</p>
              <div className="detail flex items-center">
                <MapPinHouse className="text-gray-500" />
                {!isSuperOrGlobalAdmin ? (
                  <p className="font-medium ml-1">
                    {leaveRequestRecord?.branchName || "N/A"}
                  </p>
                ) : (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                      leaveRequestRecord?.branchId
                    }`}
                    className="font-medium ml-1 text-md underline hover:text-blue-500"
                  >
                    {leaveRequestRecord?.branchName || "N/A"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* from to Information */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">From date</p>
              <div className="detail flex items-center">
                <HistoryIcon sx={{ color: "gray " }} />
                <p className="font-medium ml-1">
                  {leaveRequestRecord?.utcDate
                    ? formatDate(leaveRequestRecord?.fromDate)
                    : "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">To date</p>
              <div className="detail flex items-center">
                <HistoryIcon sx={{ color: "gray " }} />
                <p className="font-medium ml-1">
                  {leaveRequestRecord?.toDate
                    ? formatDate(leaveRequestRecord?.toDate)
                    : "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Leave duration</p>
              <div className="detail flex items-center">
                {/* <EventOutlinedIcon sx={{ color: "gray " }} /> */}
                <p className="font-medium ml-1">
                  {leaveRequestRecord?.leaveDurationDays || "N/A"} day(s)
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Approval Status</p>
              <div className="detail flex items-center">
                {/* <EventOutlinedIcon sx={{ color: "gray " }} /> */}
                <p className="font-medium ">
                  <span
                    className={`px-2 py-0.5 text-xs  text-white rounded-full flex items-center ${
                      leaveRequestRecord?.approvalStatus?.toLowerCase() ===
                      "pending"
                        ? "bg-gray-400"
                        : leaveRequestRecord?.approvalStatus?.toLowerCase() ===
                          "approved"
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  >
                    {leaveRequestRecord?.approvalStatus}
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* affected classes */}
        <div className="bg-gray-50 rounded-xl p-4 col-span-2">
          <h1 className="text-gray-500 font-bold text-xs">Affected Classes</h1>
          <div className="grid grid-cols-2 gap-2">
            {leaveRequestRecord?.affectedClasses?.length < 0 ? (
              <div className="flex-wrap mt-2">
                {leaveRequestRecord?.affectedClasses?.map(
                  (field: any, index: number) => (
                    <p
                      key={`affectedClassName-${index}`}
                      className="border border-gray-400 px-2 rounded-full py-1 w-max text-xs"
                    >
                      {index + 1}. {field?.affectedClassName}
                    </p>
                  )
                )}
              </div>
            ) : (
              "N/A"
            )}
          </div>
        </div>
        {/* Subject */}
        <div className="bg-gray-50 rounded-xl p-4 col-span-2">
          <h1 className="text-gray-500 font-bold text-xs">Subject</h1>

          <p className="subjectdetail">{leaveRequestRecord?.leaveSubject}</p>
        </div>
        {/* Reason */}
        <div className="bg-gray-50 rounded-xl p-4 col-span-2">
          <h1 className="text-gray-500 font-bold text-xs">Reason</h1>

          <p className="subjectdetail">{leaveRequestRecord?.leaveReason}</p>
        </div>

        {/* Support Reason Files */}
        <div className="bg-gray-50 rounded-xl p-4 col-span-2">
          <h1 className="text-gray-500 font-bold text-xs mb-1">
            Support Reason Files
          </h1>

          {leaveRequestRecord?.supportReasonFileUrl ? (
            <Link
              href={leaveRequestRecord?.supportReasonFileUrl}
              target="_blank"
              className="underline flex items-center hover:text-blue-500"
            >
              <File />
              <span className="ml-2">View File</span>
            </Link>
          ) : (
            "N/A"
          )}
        </div>
        {/* Approve/Reject Buttons */}
        {role?.toLowerCase() === "superadmin" &&
          !leaveRequestRecord?.isResponded && (
            <Box className="mt-0 flex gap-4">
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
                    selectedApproveStatusMode == "approved"
                      ? "success"
                      : "error"
                  }`}
                  onClick={handleApproveLeaveRequest}
                  className={
                    selectedApproveStatusMode === "approved"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {`${
                    selectedApproveStatusMode == "approved"
                      ? "Approve"
                      : "Reject"
                  }`}
                </Button>
              )}
            </Box>
          </Paper>
        </Modal>
      </div>
    </div>
  );
};

export default ViewLeaveRequest;
