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
import {
  SquareX,
  Luggage,
  MapPinHouse,
  Component,
  Book,
  CircleUser,
  Edit,
} from "lucide-react";
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

const ViewLeaveRequest = ({ testRecord, role }: any) => {
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
    return dayjs(date).tz(timeZone).format("MMM D, YYYY, ddd");
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
        testRecord
      );
      if (resData?.statusCode === 200) {
        // dispatch(removeLeaveRequest(testRecord));
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
        ...testRecord,
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
    if (testRecord) {
      setLoaded(true);
    }
  }, [testRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      {/* Header */}

      <div className="header flex items-end justify-between">
        <div className="title-name">
          <h1 className="text-2xl font-bold flex items-center">
            <Luggage />
            <span className="ml-2">Test Record Details</span>
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/testhistory/updatetestrecord/${
                testRecord?._id
              }`}
            >
              <Button variant="text" size="small">
                <Edit />
                <span className="ml-1">Edit</span>
              </Button>
            </Link>
          </h1>
          <p>of {testRecord?.studentName}</p>
        </div>

        <div className="buttons flex gap-4">
          {/* home button */}
          <Link
            href={`/${session?.data?.user?.role?.toLowerCase()}/testhistory`}
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
        </div>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="grid grid-cols-2 auto-rows-max w-full gap-3 flex-1 h-hull overflow-y-auto ">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Student Name</p>
              <div className="name-role flex justify-between items-start">
                {/* user name */}
                <div className="detail flex items-center">
                  <User className="text-gray-500" />
                  <Link
                    href={`/${role?.toLowerCase()}/students/${
                      testRecord?.studentId
                    }`}
                    className="underline hover:text-blue-500  "
                  >
                    <p className="font-bold ml-1 text-xl">
                      {testRecord?.studentName || "N/A"}
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Affiliated To</p>
              <div className="detail flex items-center">
                {/* <Calendar className="text-gray-500" /> */}
                <p className="font-medium ml-1">HCA</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Branch</p>
              <div className="detail flex items-center">
                <MapPinHouse className="text-gray-500" />
                {!isSuperOrGlobalAdmin ? (
                  <p className="font-medium ml-1">
                    {testRecord?.branchName || "N/A"}
                  </p>
                ) : (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                      testRecord?.branchId
                    }`}
                    className="font-medium ml-1 text-md underline hover:text-blue-500"
                  >
                    {testRecord?.branchName || "N/A"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Exam date Information */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Exam Date</p>
              <div className="detail flex items-center">
                <HistoryIcon sx={{ color: "gray " }} />
                <p className="font-bold ml-1 text-xl ">
                  {testRecord?.examUtcDate
                    ? formatDate(testRecord?.examUtcDate)
                    : "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Batch name</p>
              <div className="detail flex items-center">
                <Component className="text-gray-500" />
                {!isSuperOrGlobalAdmin ? (
                  <p className="font-medium ml-1">
                    {testRecord?.batchName || "N/A"}
                  </p>
                ) : (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/batches/${
                      testRecord?.batchId
                    }`}
                    className="font-medium ml-1 text-md underline hover:text-blue-500"
                  >
                    {testRecord?.batchName || "N/A"}
                  </Link>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Course name</p>
              <div className="detail flex items-center">
                <Book className="text-gray-500" />
                {!isSuperOrGlobalAdmin ? (
                  <p className="font-medium ml-1">
                    {testRecord?.courseName || "N/A"}
                  </p>
                ) : (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/courses/${
                      testRecord?.courseId
                    }`}
                    className="font-medium ml-1 text-md underline hover:text-blue-500"
                  >
                    {testRecord?.courseName || "N/A"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Exam information */}
        <div className="bg-gray-50 rounded-xl p-4 col-span-2">
          <h1 className="text-gray-500 font-bold text-xs mb-2">
            Exam Information
          </h1>
          <div className="grid grid-cols-3 gap-2">
            {/* exam title */}
            <div className="col-span-3">
              <p className="text-xs text-gray-500 ">Exam Title</p>
              <div className="detail flex items-center">
                {/* <Calendar className="text-gray-500" /> */}
                <p className="font-bold text-xl ">{testRecord?.examTitle}</p>
              </div>
            </div>
            {/* total marks */}
            <div className="">
              <p className="text-xs text-gray-500 ">Total Marks</p>
              <div className="detail flex items-center">
                {/* <Calendar className="text-gray-500" /> */}
                <p className="font-medium ">{testRecord?.totalMarks}</p>
              </div>
            </div>
            {/* pass marks */}
            <div className="">
              <p className="text-xs text-gray-500 ">Pass Marks</p>
              <div className="detail flex items-center">
                {/* <Calendar className="text-gray-500" /> */}
                <p className="font-medium ">{testRecord?.passMarks}</p>
              </div>
            </div>
            {/* obtainedScore */}
            <div className="">
              <p className="text-xs text-gray-500 ">Obtained Score</p>
              <div className="detail flex items-center">
                {/* <Calendar className="text-gray-500" /> */}
                <p
                  className={`font-bold text-xl ${
                    testRecord?.resultStatus?.toLowerCase() == "pass"
                      ? "text-green-500"
                      : "text-red-500"
                  } `}
                >
                  {testRecord?.obtainedScore}
                </p>
              </div>
            </div>
            {/* result status */}
            <div className="">
              <p className="text-xs text-gray-500">Result Status</p>
              <div className={`detail flex items-center gap-2 p-2 rounded-md `}>
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    testRecord?.resultStatus?.toLowerCase() === "pass"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <p
                  className={`font-bold text-gray-700 rounded-full px-3 py-1 text-sm  ${
                    testRecord?.resultStatus?.toLowerCase() === "pass"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {testRecord?.resultStatus}
                </p>
              </div>
            </div>

            {/* checked by */}
            <div className="">
              <p className="text-xs text-gray-500">Checked By</p>
              <div className="name-role flex justify-between items-start">
                {/* user name */}
                <div className="detail flex items-center">
                  <CircleUser className="text-gray-500" />
                  {isSuperOrGlobalAdmin ? (
                    <Link
                      href={`/${role?.toLowerCase()}/users/${
                        testRecord?.checkedById
                      }`}
                      className="underline hover:text-blue-500"
                    >
                      <p className="font-bold ml-1 text-xl">
                        {testRecord?.checkedByName || "N/A"}
                      </p>
                    </Link>
                  ) : (
                    <p className="font-bold ml-1 text-xl">
                      {testRecord?.checkedByName || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Reason Files */}
        <div className="bg-gray-50 rounded-xl p-4 col-span-2">
          <h1 className="text-gray-500 font-bold text-xs mb-1">
            Test Material File
          </h1>

          {testRecord?.testMaterialUrl ? (
            <Link
              href={testRecord?.testMaterialUrl}
              target="_blank"
              className="underline hover:text-blue-500"
            >
              <InsertDriveFileIcon />
              <span className="ml-2">View File</span>
            </Link>
          ) : (
            "N/A"
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLeaveRequest;
