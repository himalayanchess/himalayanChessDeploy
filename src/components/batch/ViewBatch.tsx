import React, { useEffect, useState } from "react";
import { Button, Divider } from "@mui/material";
import {
  LayoutDashboard,
  BookOpenCheck,
  CircleUser,
  Users,
  BookCopy,
  School,
  Component,
  LayoutList,
  Luggage,
  CircleFadingArrowUp,
  CalendarCheck2,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents } from "@/redux/allListSlice";
import BatchStudentList from "./BatchStudentList";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewBatch = ({ batchRecord }: any) => {
  const dispatch = useDispatch<any>();
  // console.log(batchRecord);
  const { allActiveStudentsList } = useSelector(
    (state: any) => state.allListReducer
  );

  //state vars
  const [selectedStudentStatus, setselectedStudentStatus] = useState("all");
  const [loaded, setLoaded] = useState(false);
  const [filteredStudentList, setfilteredStudentList] = useState([]);
  const [studentCount, setstudentCount] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });

  // filter studnet based on student batch status
  useEffect(() => {
    let tempFilteredStudents = [];

    // students of this batch
    const totalFilteredStudents = allActiveStudentsList.filter((student: any) =>
      student.batches.some((batch: any) => batch.batchId == batchRecord?._id)
    );

    const activeStudents = totalFilteredStudents.filter((student: any) =>
      student.batches.some(
        (batch: any) => !batch.endDate // Batch is active, no endDate
      )
    );

    const completedStudents = totalFilteredStudents.filter((student: any) =>
      student.batches.some((batch: any) => batch.endDate)
    );

    //total count
    setstudentCount((prev) => ({
      ...prev,
      total: totalFilteredStudents?.length,
      active: activeStudents?.length,
      completed: completedStudents?.length,
    }));

    // active students
    if (selectedStudentStatus?.toLowerCase() == "all") {
      tempFilteredStudents = totalFilteredStudents;
    }
    // active students
    else if (selectedStudentStatus?.toLowerCase() == "active") {
      tempFilteredStudents = activeStudents;
    }
    // batch completed students
    else if (selectedStudentStatus?.toLowerCase() == "completed") {
      tempFilteredStudents = completedStudents;
    }

    setfilteredStudentList(tempFilteredStudents);
  }, [allActiveStudentsList, selectedStudentStatus]);

  // get intital all students
  useEffect(() => {
    dispatch(getAllStudents());
  }, []);

  useEffect(() => {
    if (batchRecord) {
      setLoaded(true);
    }
  }, [batchRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      <div className="header flex items-end justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Component />
          <span className="ml-2">Batch Details</span>
        </h1>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="space-y-4 h-full mt-4 flex flex-col overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 overflow-y-auto">
          {/* Basic Batch Information */}
          <div>
            <p className="font-bold text-xs text-gray-500">Batch Name:</p>
            <p>{batchRecord?.batchName || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Affiliated To:</p>
            <p>{batchRecord?.affiliatedTo || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Status:</p>
            <p
              className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                batchRecord?.completedStatus === "Ongoing"
                  ? "bg-green-400"
                  : "bg-blue-400"
              }`}
            >
              {batchRecord?.completedStatus || "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Start Date:</p>
            <p>
              {batchRecord?.batchStartDate
                ? dayjs(batchRecord.batchStartDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">End Date:</p>
            <p>
              {batchRecord?.batchEndDate
                ? dayjs(batchRecord.batchEndDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Active Status:</p>
            <p
              className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                batchRecord?.activeStatus ? "bg-green-400" : "bg-red-400"
              }`}
            >
              {batchRecord?.activeStatus ? "Active" : "Inactive"}
            </p>
          </div>

          {/* Project Information */}
          <div className="col-span-3 mt-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">
              Associated Project
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-bold text-xs text-gray-500">Project Name:</p>
                <p>{batchRecord?.projectName || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="students-list col-span-3">
            <h1 className="font-bold">Students</h1>
            <div className="buttons mt-2 flex gap-4">
              <Button
                variant={`${
                  selectedStudentStatus?.toLowerCase() == "all"
                    ? "contained"
                    : "outlined"
                }`}
                onClick={() => setselectedStudentStatus("all")}
              >
                All
              </Button>
              <Button
                variant={`${
                  selectedStudentStatus?.toLowerCase() == "active"
                    ? "contained"
                    : "outlined"
                }`}
                onClick={() => setselectedStudentStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={`${
                  selectedStudentStatus?.toLowerCase() == "completed"
                    ? "contained"
                    : "outlined"
                }`}
                onClick={() => setselectedStudentStatus("completed")}
              >
                Completed
              </Button>
            </div>

            {/* count details */}
            <div className="count-details mt-5 flex gap-8">
              {/* total students */}
              <div className="total">
                <p>
                  Total:
                  <span className="bg-gray-400 text-white rounded-md ml-2 px-2 py-1 font-bold">
                    {studentCount?.total}
                  </span>
                </p>
              </div>

              {/* Active students */}
              <div className="active">
                <p>
                  Active:
                  <span className="bg-gray-400 text-white rounded-md ml-2 px-2 py-1 font-bold">
                    {studentCount?.active}
                  </span>
                </p>
              </div>

              {/* completed students */}
              <div className="completed">
                <p>
                  Completed:
                  <span className="bg-gray-400 text-white rounded-md ml-2 px-2 py-1 font-bold">
                    {studentCount?.completed}
                  </span>
                </p>
              </div>
            </div>

            {/* studentlist */}
            <BatchStudentList
              studentList={filteredStudentList}
              batchId={batchRecord?._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBatch;
