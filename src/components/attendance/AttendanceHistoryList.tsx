import React, { useEffect, useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import dayjs from "dayjs";
import HistoryIcon from "@mui/icons-material/History";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { Divider } from "@mui/material";
import Dropdown from "../Dropdown";
import { useSession } from "next-auth/react";
import { getAllBranches } from "@/redux/allListSlice";
import { setattendanceUpdatedByData } from "@/redux/attendanceSlice";

dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const AttendanceHistoryList = () => {
  const dispatch = useDispatch<any>();

  const { selectedDatesAttendanceRecord } = useSelector(
    (state: any) => state.attendanceReducer
  );

  const { allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );
  // console.log(
  //   "selcted dates attendance record ",
  //   selectedDatesAttendanceRecord
  // );
  const session = useSession();

  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  const [selectedBranch, setselectedBranch] = useState("");
  const [filteredAttendance, setfilteredAttendance] = useState([]);

  // change latest updated by when branch changes
  useEffect(() => {
    let tempFilteredLatestUpdatedbyList: any[] = [];

    const updatedByList = selectedDatesAttendanceRecord?.updatedBy;

    if (Array.isArray(updatedByList)) {
      tempFilteredLatestUpdatedbyList =
        selectedBranch?.toLowerCase() === "all"
          ? updatedByList
          : updatedByList.filter(
              (updatedBy: any) =>
                updatedBy?.userBranch?.toLowerCase() ===
                selectedBranch?.toLowerCase()
            );
    }

    const latestUpdate = tempFilteredLatestUpdatedbyList.length
      ? tempFilteredLatestUpdatedbyList[
          tempFilteredLatestUpdatedbyList.length - 1
        ]
      : null;

    dispatch(setattendanceUpdatedByData(latestUpdate));
  }, [selectedBranch, selectedDatesAttendanceRecord?.updatedBy]);

  //filter attendace
  useEffect(() => {
    if (!selectedDatesAttendanceRecord) {
      setfilteredAttendance([]);
      return;
    }

    const records = selectedDatesAttendanceRecord.userAttendance;

    if (selectedBranch?.toLowerCase() === "all") {
      setfilteredAttendance(records);
    } else {
      const filtered = records.filter(
        (record: any) =>
          record?.userBranch?.toLowerCase() === selectedBranch?.toLowerCase()
      );
      setfilteredAttendance(filtered);
    }
  }, [selectedDatesAttendanceRecord, selectedBranch]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    let branchName = "All";
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
    }
    setselectedBranch(branchName);
  }, [session?.data?.user]);

  //initial load
  useEffect(() => {
    dispatch(getAllBranches());
  }, []);

  return (
    <div className="flex flex-col h-full bg-white p-5 rounded-md shadow-md">
      {/* header */}
      <div className="header flex flex-col ">
        {/* title */}
        <p className="text-2xl flex items-center">
          <HistoryIcon sx={{ fontSize: "1.7rem" }} />
          <span className="ml-2">Attendance History</span>
        </p>
        {/* dropdown-date */}
        <div className="dropdown-date flex items-end  gap-4">
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
            Showing {filteredAttendance?.length} users
          </span>
          {/* right side */}
          <div className=" text-xl ml-auto">
            {!selectedDatesAttendanceRecord ? (
              <span className="text-gray-500 text-sm">No record found</span>
            ) : (
              <>
                <span>
                  {dayjs(selectedDatesAttendanceRecord?.utcDate)
                    .tz(timeZone)
                    .startOf("day")
                    .format("MMMM D, YYYY - dddd")}
                </span>
                <span className="ml-4">
                  #Week{dayjs().tz(timeZone).startOf("day").week()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".5rem 0" }} />

      {/* attendance list */}
      <div className="attendanceTable mt-2 rounded-md border h-full flex-1 overflow-y-auto">
        {/* Header */}
        <div className="py-2  grid grid-cols-[70px,repeat(5,1fr)] bg-gray-100 ">
          <span className="font-bold text-center text-sm ">SN</span>
          <span className="font-bold text-sm col-span-2">Name</span>
          <span className="font-bold text-sm">Role</span>
          <span className="font-bold text-sm">Branch</span>
          <span className="font-bold text-center  text-sm">Status</span>
        </div>

        {/* attendance data */}
        <div className="mt-2">
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((record: any, index: number) => (
              <div
                key={record.id || index}
                className="py-3 border-b grid grid-cols-[70px,repeat(5,1fr)] items-center transition-all ease duration-150 hover:bg-gray-100"
              >
                <p className="text-center text-sm">{index + 1}</p>
                <p className="text-left text-sm col-span-2">
                  {record.userName}
                </p>
                <p className="text-left text-xs">
                  {record.userRole}
                  {record?.userIsGlobalAdmin && (
                    <span className="bg-gray-400 text-white font-bold text-xs px-2 py-0.5 rounded-full ml-2">
                      {"Global"}
                    </span>
                  )}
                </p>

                <p className="text-left text-xs">
                  {record.userBranch || "N/A"}
                </p>

                <p className="text-center text-sm">
                  <span
                    className={`px-2 py-1 rounded-full  text-white text-xs font-bold
      ${
        record.status === "present"
          ? "bg-green-400"
          : record.status === "absent"
          ? "bg-red-400"
          : record.status === "leave"
          ? "bg-blue-400"
          : record.status === "holiday"
          ? "bg-purple-400"
          : "bg-gray-400"
      }
    `}
                  >
                    {record.status}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No attendance records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryList;
