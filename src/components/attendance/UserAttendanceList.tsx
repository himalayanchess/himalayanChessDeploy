import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Divider,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { useSession } from "next-auth/react";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { notify } from "@/helpers/notify";
import { CalendarCheck2 } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  getAllAttendanceRecords,
  setattendanceUpdatedByData,
  updateAttendanceChartData,
} from "@/redux/attendanceSlice";
import Dropdown from "../Dropdown";
import { getAllBranches } from "@/redux/allListSlice";

dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const UserAttendanceList = ({ allActiveUsersList, allUsersLoading }: any) => {
  const dispatch = useDispatch<any>();

  const { allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  const session = useSession();

  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  const { control, handleSubmit, watch, reset } = useForm<any>({
    defaultValues: {
      userAttendance: [],
    },
  });

  const { fields, replace } = useFieldArray<any>({
    control,
    name: "userAttendance",
  });

  // state vars
  const [filteredUsers, setfilteredUsers] = useState<any>([]);
  const [saveAttendanceLoading, setsaveAttendanceLoading] = useState(false);
  const [attendanceStateChanged, setattendanceStateChanged] = useState(false);
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [allUpdatedByList, setallUpdatedByList] = useState<any>([]);
  const [selectedBranch, setselectedBranch] = useState("");

  // Watch attendance data for real-time updates
  const userAttendance = watch("userAttendance");

  // change latest updated by when branch changes
  useEffect(() => {
    const tempFilteredLatestUpdatedbyList =
      selectedBranch?.toLowerCase() == "all"
        ? allUpdatedByList
        : allUpdatedByList?.filter(
            (updatedBy: any) =>
              updatedBy?.userBranch?.toLowerCase() ==
              selectedBranch?.toLowerCase()
          );

    let latestUpdate =
      tempFilteredLatestUpdatedbyList[
        tempFilteredLatestUpdatedbyList.length - 1
      ];

    dispatch(setattendanceUpdatedByData(latestUpdate));
  }, [selectedBranch, allUpdatedByList]);

  // chart data
  useEffect(() => {
    if (!initialLoadComplete) return;
    let filtered =
      selectedBranch?.toLowerCase() === "all"
        ? userAttendance
        : userAttendance.filter(
            (user: any) =>
              user?.userBranch?.toLowerCase() === selectedBranch?.toLowerCase()
          );

    // Use filteredUsers instead of userAttendance
    const present =
      filtered?.filter((a: any) => a.status === "present").length || 0;
    const absent =
      filtered?.filter((a: any) => a.status === "absent").length || 0;
    const leave =
      filtered?.filter((a: any) => a.status === "leave").length || 0;
    const holiday =
      filtered?.filter((a: any) => a.status === "holiday").length || 0;

    const total = filtered?.length ?? 0;

    const chartData = [
      {
        name: "Total",
        value: total,
        color: "#afbffa", // Light blue
      },
      {
        name: "Present",
        value: present,
        color: "#9cffbb", // Light green
      },
      {
        name: "Absent",
        value: absent,
        color: "#ff9ca1", // Light red
      },
      {
        name: "Leave",
        value: leave,
        color: "#fce38a", // Light yellow
      },
      {
        name: "Holiday",
        value: holiday,
        color: "#d3d3d3", // Light gray
      },
    ];

    dispatch(updateAttendanceChartData(chartData));
  }, [
    filteredUsers,
    userAttendance,
    selectedBranch,
    initialLoadComplete,
    attendanceStateChanged,
  ]); // Changed dependency to filteredUsers

  // filter users according to branch
  useEffect(() => {
    let filteredUsers =
      selectedBranch?.toLowerCase() === "all"
        ? fields
        : fields.filter(
            (user: any) =>
              user?.userBranch?.toLowerCase() === selectedBranch?.toLowerCase()
          );

    setfilteredUsers(filteredUsers);
  }, [fields, selectedBranch]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);
    let branchName = "All";
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
    }
    setselectedBranch(branchName);
  }, [session?.data?.user]);

  // Set default values when users load
  useEffect(() => {
    if (
      allActiveUsersList &&
      allActiveUsersList.length > 0 &&
      !initialLoadComplete
    ) {
      const initializeAttendance = async () => {
        // First try to load existing attendance
        const hasAttendance = await checkForTodaysAttendance();

        // Only set defaults if no attendance was found
        if (!hasAttendance) {
          const defaultAttendance = allActiveUsersList.map((user: any) => ({
            userId: user._id,
            userName: user.name,
            userRole: user.role,
            userBranch: user.branchName,
            userIsGlobalAdmin: user.isGlobalAdmin,
            status: "absent",
          }));
          replace(defaultAttendance);
        }
        setInitialLoadComplete(true);
      };

      initializeAttendance();
    }
  }, [allActiveUsersList, initialLoadComplete, session?.data?.user]);

  async function checkForTodaysAttendance() {
    try {
      const { data: resData } = await axios.get(
        "/api/attendance/checkForTodaysAttendance"
      );

      if (resData?.statusCode === 200 && resData?.attendanceRecord) {
        const updatedAttendance = resData.attendanceRecord.userAttendance.map(
          (user: any) => ({
            userId: user.userId,
            userName: user.userName,
            userRole: user.userRole,
            userBranch: user.userBranch,
            userIsGlobalAdmin: user.userIsGlobalAdmin,
            status: user.status,
          })
        );

        replace(updatedAttendance);
        setfilteredUsers(updatedAttendance); // Update filtered users initially

        // updated by according to branch
        if (resData?.attendanceRecord?.updatedBy?.length > 0) {
          // setallupdatedbylist so that i can filter latest udpted by when branch changes
          setallUpdatedByList(resData?.attendanceRecord?.updatedBy);

          const updatedByList = resData.attendanceRecord.updatedBy;
          let latestUpdate;
          if (isSuperOrGlobalAdmin) {
            latestUpdate = updatedByList[updatedByList.length - 1];
          } else {
            let filteredUpdatedByByBranch = updatedByList?.filter(
              (updatedBy: any) =>
                updatedBy?.userBranch?.toLowerCase() ===
                session?.data?.user?.branchName?.toLowerCase()
            );
            latestUpdate =
              filteredUpdatedByByBranch[filteredUpdatedByByBranch.length - 1];
          }

          if (latestUpdate) {
            dispatch(setattendanceUpdatedByData(latestUpdate));
          }
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking today's attendance:", error);
      return false;
    }
  }

  async function onSubmit(data: any) {
    setsaveAttendanceLoading(true);
    try {
      const { data: resData } = await axios.post(
        "/api/attendance/addOrUpdateAttendance",
        {
          userAttendance,
          updatedByUser: {
            userId: session?.data?.user?._id,
            userRole: session?.data?.user?.role,
            userName: session?.data?.user?.name,
            userBranch: session?.data?.user?.branchName,
            updatedAt: dayjs().tz(timeZone).utc(),
          },
        }
      );

      if (resData?.statusCode === 200) {
        handleconfirmModalClose();
        // update the attendanceUpdateByData
        const updatedByUser = {
          userId: session?.data?.user?._id,
          userRole: session?.data?.user?.role,
          userName: session?.data?.user?.name,
          userBranch: session?.data?.user?.branchName,
          updatedAt: dayjs().tz(timeZone).utc().format(),
        };

        dispatch(setattendanceUpdatedByData(updatedByUser));
        setallUpdatedByList((prev: any) => [...prev, updatedByUser]);
        // update attendance record list of today
        dispatch(getAllAttendanceRecords());
      }
      notify(resData?.msg, resData?.statusCode);
    } catch (error) {
      console.error("Error saving attendance:", error);
      notify("Failed to save attendance", 500);
    } finally {
      setsaveAttendanceLoading(false);
    }
  }

  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }

  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  //initial load
  useEffect(() => {
    dispatch(getAllBranches());
  }, []);

  if (allUsersLoading || !initialLoadComplete) {
    return (
      <div className="flex flex-col h-full bg-white p-5 rounded-md shadow-md">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
          <Typography ml={2}>Loading attendance...</Typography>
        </Box>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full bg-white p-5 rounded-md shadow-md"
    >
      {/* header */}
      <div className="header flex justify-between items-end">
        {/* title */}
        <div className="title-dropdown flex items-end gap-4">
          <p className="text-2xl flex items-end">
            <CalendarCheck2 />
            <span className="ml-2">Daily Attendance</span>
          </p>
          <Dropdown
            label="Branch"
            options={[
              "All",
              ...(allActiveBranchesList?.map(
                (branch: any) => branch.branchName
              ) || []),
            ]}
            selected={selectedBranch}
            disabled={!isSuperOrGlobalAdmin}
            onChange={setselectedBranch}
          />

          <span className="text-sm text-gray-500">
            Showing {filteredUsers?.length} users
          </span>
        </div>
        {/* date */}
        <p className="text-xl">
          {dayjs().tz(timeZone).startOf("day").format("MMMM D, YYYY - dddd")}
          <span className="ml-4">
            #Week{dayjs().tz(timeZone).startOf("day").week()}
          </span>
        </p>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".5rem 0" }} />

      <div className="attendanceTable mt-2 rounded-md border h-full flex-1 overflow-y-auto">
        {/* Header */}
        <div className="py-2  grid grid-cols-[50px,repeat(5,1fr)] gap-2 bg-gray-100 ">
          <span className="font-bold text-center text-sm">SN</span>
          <span className="font-bold text-sm">Name</span>
          <span className="font-bold text-sm">Role</span>
          <span className="font-bold text-sm">Branch</span>
          <span className="font-bold text-center col-span-2 text-sm">
            Status
          </span>
        </div>

        {/* User List */}
        <div className="mt-2">
          {filteredUsers.map((field: any, filteredIndex: any) => {
            // Find the original index in the fields array
            const originalIndex = fields.findIndex(
              (f: any) => f.userId === field.userId
            );

            return (
              <div
                key={`${field.userName}_${filteredIndex}`}
                className="py-2 border-b grid grid-cols-[50px,repeat(5,1fr)] gap-2 items-center transition-all ease duration-150 hover:bg-gray-100"
              >
                <p className="text-center text-sm">{filteredIndex + 1}</p>
                <p className="text-left  text-sm">{field.userName}</p>
                <p className="text-left text-xs">
                  {field.userRole}
                  {field?.userIsGlobalAdmin && (
                    <span className="bg-gray-400 text-white font-bold text-xs px-2 py-0.5 rounded-full ml-2">
                      {"Global"}
                    </span>
                  )}
                </p>
                <p className="text-left text-xs">{field.userBranch || "N/A"}</p>

                <div className="status-column col-span-2 w-full">
                  <Controller
                    name={`userAttendance.${originalIndex}.status`} // Use originalIndex here
                    control={control}
                    render={({ field }: any) => (
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(4, 1fr)"
                        gap={1}
                      >
                        {["present", "absent", "leave", "holiday"].map(
                          (status) => (
                            <Button
                              key={status}
                              variant={
                                field.value === status
                                  ? "contained"
                                  : "outlined"
                              }
                              color={
                                status === "present"
                                  ? "success"
                                  : status === "absent"
                                  ? "error"
                                  : status === "leave"
                                  ? "info"
                                  : "secondary"
                              }
                              onClick={() => {
                                field.onChange(status);
                                console.log("selected index", originalIndex);

                                setattendanceStateChanged((prev) => !prev);
                              }}
                              startIcon={
                                status === "present" ? (
                                  <CheckCircle />
                                ) : status === "absent" ? (
                                  <Cancel />
                                ) : status === "leave" ? (
                                  <Cancel />
                                ) : (
                                  <Cancel />
                                )
                              }
                              size="small"
                              sx={{
                                textTransform: "none",
                                padding: ".3rem .7rem",
                                height: "max-content",
                                width: "max-content",
                                fontSize: "0.7rem",
                              }}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Button>
                          )
                        )}
                      </Box>
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* submit button */}
      <Button
        onClick={handleconfirmModalOpen}
        variant="contained"
        color="primary"
        sx={{ marginTop: "1rem", width: "max-content" }}
      >
        Save Attendance
      </Button>

      {/* Hidden Submit Button */}
      <button type="submit" id="hiddenSubmit" hidden></button>

      {/* confirm modal */}
      <Modal
        open={confirmModalOpen}
        onClose={handleconfirmModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center"
      >
        <Box className="w-[400px] h-max p-6  flex flex-col items-center bg-white rounded-xl shadow-lg">
          <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
          <p className="mb-6 text-gray-600">
            You want to update todays attendance.
          </p>
          <div className="buttons flex gap-5">
            <Button
              variant="outlined"
              onClick={handleconfirmModalClose}
              className="text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            {saveAttendanceLoading ? (
              <LoadingButton
                size="large"
                loading={saveAttendanceLoading}
                loadingPosition="start"
                variant="contained"
                className="mt-7"
              >
                <span className="">Saving</span>
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  document.getElementById("hiddenSubmit")?.click();
                }}
              >
                Save attendance
              </Button>
            )}
          </div>
        </Box>
      </Modal>
    </form>
  );
};

export default UserAttendanceList;
