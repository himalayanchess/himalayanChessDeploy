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
  setattendanceUpdatedByData,
  updateAttendanceChartData,
} from "@/redux/attendanceSlice";

dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const UserAttendanceList = ({ allActiveUsersList, allUsersLoading }: any) => {
  // dispatch
  const dispatch = useDispatch<any>();
  // selector
  // const { attendanceChartData } = useSelector(
  //   (state: any) => state.attendanceReducer
  // );
  const session = useSession();

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      userAttendance: [],
    },
  });

  const { fields, replace } = useFieldArray<any>({
    control,
    name: "userAttendance",
  });

  // state vars

  const [userListLoaded, setuserListLoaded] = useState(false);
  const [attendanceStatusChanged, setattendanceStatusChanged] = useState(false);
  const [saveAttendanceLoading, setsaveAttendanceLoading] = useState(false);
  // confirm modal
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);

  // handleconfirmModalOpen
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }
  // handleconfirmModalClose
  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  // Watch attendance data for real-time updates
  const userAttendance = watch("userAttendance");

  // Calculate chart data
  useEffect(() => {
    const chartData = [
      {
        name: "Attendance",
        present:
          userAttendance?.filter((a) => a.status === "present").length || 0,
        absent:
          userAttendance?.filter((a) => a.status === "absent").length || 0,
        leave: userAttendance?.filter((a) => a.status === "leave").length || 0,
        holiday:
          userAttendance?.filter((a) => a.status === "holiday").length || 0,
        total: userAttendance?.length || 0,
      },
    ];

    dispatch(updateAttendanceChartData(chartData));
  }, [attendanceStatusChanged, userAttendance]);

  // Reset form when users load
  useEffect(() => {
    if (allActiveUsersList && !userListLoaded) {
      setuserListLoaded(false);

      // First, replace with default values (initial load)
      replace(
        allActiveUsersList.map((user) => ({
          userId: user._id,
          userName: user.name,
          userRole: user.role,
          status: "absent",
        }))
      );

      setuserListLoaded(true);
    }
  }, [allActiveUsersList, replace]);

  // submit function
  async function onSubmit(data: any) {
    setsaveAttendanceLoading(true);
    const { data: resData } = await axios.post(
      "/api/attendance/addOrUpdateAttendance",
      {
        userAttendance,
        updatedByUser: {
          userId: session?.data?.user?._id,
          userRole: session?.data?.user?.role,
          userName: session?.data?.user?.name,
          updatedAt: dayjs().tz(timeZone).utc(),
        },
      }
    );
    if (resData?.statusCode == 200) {
      handleconfirmModalClose();
      // update updatedby reducer state
      dispatch(
        setattendanceUpdatedByData({
          userId: session?.data?.user?._id,
          userRole: session?.data?.user?.role,
          userName: session?.data?.user?.name,
          updatedAt: dayjs().tz(timeZone).utc().format(),
        })
      );
    }

    notify(resData?.msg, resData?.statusCode);
    setsaveAttendanceLoading(false);
  }

  async function checkForTodaysAttendance() {
    const { data: resData } = await axios.get(
      "/api/attendance/checkForTodaysAttendance"
    );
    if (resData?.statusCode == 200) {
      replace(
        resData?.attendanceRecord?.userAttendance?.map((user) => ({
          userId: user.userId,
          userName: user.userName,
          userRole: user.userRole,
          status: user.status,
        }))
      );
      dispatch(
        setattendanceUpdatedByData(
          resData?.attendanceRecord?.updatedBy[
            resData?.attendanceRecord?.updatedBy?.length - 1
          ]
        )
      );
    }
  }

  // get initial todays attendance
  // for showing persistant data
  useEffect(() => {
    if (userListLoaded) {
      // Ensure this is awaited properly before modifying the state
      checkForTodaysAttendance();
    }
  }, [userListLoaded]);

  if (!userListLoaded) return <div></div>;

  if (allUsersLoading) {
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
      <div className="header flex justify-between items-center">
        {/* title */}
        <p className="text-2xl flex items-center">
          <CalendarCheck2 />
          <span className="ml-2">Daily Attendance</span>
        </p>
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
        <div className="py-2  grid grid-cols-[70px,repeat(4,1fr)] bg-gray-100 ">
          <span className="font-bold text-center text-sm">SN</span>
          <span className="font-bold text-sm">Name</span>
          <span className="font-bold text-sm">Role</span>
          <span className="font-bold text-center col-span-2 text-sm">
            Status
          </span>
        </div>

        {/* User List */}
        <div className="mt-2">
          {fields.map((field: any, index: any) => (
            <div
              key={field.id}
              className="py-2 border-b grid grid-cols-[70px,repeat(4,1fr)] items-center transition-all ease duration-150 hover:bg-gray-100"
            >
              <p className="text-center text-sm">{index + 1}</p>
              <p className="text-left  text-sm">{field.userName}</p>
              <p className="text-left text-sm">{field.userRole}</p>

              <div className="status-column col-span-2 w-full">
                <Controller
                  name={`userAttendance.${index}.status`}
                  control={control}
                  render={({ field }: any) => (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={2}
                      flexWrap="wrap"
                    >
                      {["present", "absent", "leave", "holiday"].map(
                        (status) => (
                          <Button
                            key={status}
                            variant={
                              field.value === status ? "contained" : "outlined"
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
                              setattendanceStatusChanged((prev) => !prev);
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
          ))}
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

      {/* Hidden Submit Button (Inside Form) */}
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
                  document.getElementById("hiddenSubmit").click();
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
