// import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { useSession } from "next-auth/react";
import StudentAttendance from "./StudentAttendance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import BasicStudentInfo from "./studentrecorddetails/BasicStudentInfo";
import StudentBatchesInfo from "./studentrecorddetails/StudentBatchesInfo";
import StudentCoursesInfo from "./studentrecorddetails/StudentCoursesInfo";
import StudentTestHistory from "./studentrecorddetails/StudentTestHistory";
import StudentActivityRecords from "./studentrecorddetails/StudentActivityRecords";
import StudentPayment from "./studentrecorddetails/StudentPayment";
import StudentEventInfo from "./studentrecorddetails/StudentEventInfo";
import { fetchAllStudentsActivityRecords } from "@/redux/activityRecordSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewStudent = ({ studentRecord, loading }: any) => {
  const session = useSession();

  const {
    allActiveStudentsActivityRecords,
    allStudentsActivityRecordsLoading,
  } = useSelector((state: any) => state.activityRecordReducer);

  // dispatch
  const dispatch = useDispatch<any>();

  const [loaded, setLoaded] = useState(false);
  const [studentBatches, setstudentBatches] = useState([]);
  const [studentEnrolledCourses, setstudentEnrolledCourses] = useState([]);
  const [selectedBatchStatus, setselectedBatchStatus] = useState("All");
  const [selectedEnrolledCourseStatus, setselectedEnrolledCourseStatus] =
    useState("All");
  const [selectedMenu, setSelectedMenu] = useState("basic");

  const handleMenuClick = (menuValue: any) => {
    setSelectedMenu(menuValue); // Update the selected menu
  };

  const menuItems = [
    { label: "Basic Information", value: "basic" },
    { label: "Batches", value: "batches" },
    { label: "Enrolled Courses", value: "courses" },
    { label: "Test History", value: "testhistory" },
    { label: "Activity Records", value: "activity" },
    { label: "Payment", value: "payment" },
    { label: "Tournaments & Events", value: "events" },
  ];

  // show dynamic compnent
  const showComponent = () => {
    if (studentRecord) {
      switch (selectedMenu) {
        case "basic":
          return <BasicStudentInfo studentRecord={studentRecord} />;
        case "batches":
          return <StudentBatchesInfo studentRecord={studentRecord} />;
        case "courses":
          return <StudentCoursesInfo studentRecord={studentRecord} />;
        case "testhistory":
          return <StudentTestHistory studentRecord={studentRecord} />;
        case "activity":
          return (
            <StudentActivityRecords
              studentRecord={studentRecord}
              allActiveStudentsActivityRecords={
                allActiveStudentsActivityRecords
              }
              allStudentsActivityRecordsLoading={
                allStudentsActivityRecordsLoading
              }
            />
          );
        case "payment":
          return <StudentPayment studentRecord={studentRecord} />;
        case "events":
          return <StudentEventInfo studentRecord={studentRecord} />;
        default:
          return <BasicStudentInfo studentRecord={studentRecord} />;
      }
    }
  };

  // fitler student batches
  useEffect(() => {
    if (studentRecord?.batches) {
      // only active batches (not deleted)
      let tempStudentBatches = studentRecord?.batches?.filter(
        (batch: any) => batch?.activeStatus
      );

      if (selectedBatchStatus?.toLowerCase() == "active") {
        tempStudentBatches = tempStudentBatches.filter(
          (batch: any) => !batch?.endDate
        );
      } else if (selectedBatchStatus?.toLowerCase() == "completed") {
        tempStudentBatches = tempStudentBatches.filter(
          (batch: any) => batch?.endDate
        );
      }

      setstudentBatches(tempStudentBatches);
    }
  }, [studentRecord, selectedBatchStatus]);

  // fitler student enrolled courses
  useEffect(() => {
    if (studentRecord?.enrolledCourses) {
      // only active enrolled courses (not deleted)
      let tempStudentEnrolledCourses = studentRecord?.enrolledCourses?.filter(
        (course: any) => course?.activeStatus
      );

      if (selectedEnrolledCourseStatus?.toLowerCase() == "active") {
        tempStudentEnrolledCourses = tempStudentEnrolledCourses.filter(
          (course: any) => !course?.endDate
        );
      } else if (selectedEnrolledCourseStatus?.toLowerCase() == "completed") {
        tempStudentEnrolledCourses = tempStudentEnrolledCourses.filter(
          (course: any) => course?.endDate
        );
      }

      setstudentEnrolledCourses(tempStudentEnrolledCourses);
    }
  }, [studentRecord, selectedEnrolledCourseStatus]);

  // loaded
  useEffect(() => {
    if (studentRecord) {
      setLoaded(true);
      dispatch(fetchAllStudentsActivityRecords(studentRecord?._id));
    }
  }, [studentRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5"></div>
    );

  return (
    <div className="  flex-1 h-full flex w-full  ">
      {loaded && loading ? (
        <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
          <CircularProgress />
          <span className="mt-2">Loading student details ...</span>
        </div>
      ) : (
        <div className="userdetails w-full h-full overflow-auto bg-white rounded-md shadow-md mr-4 px-7 py-4 flex flex-col">
          <div className="header flex flex-col items-start justify-between  gap-2 ">
            <div className="title flex flex-col">
              <h1 className="text-2xl font-bold">Student Detail</h1>
              <p>of {studentRecord?.name}</p>
            </div>

            {/* menu buttons */}
            <div className="menuButtons grid grid-cols-7 gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.value}
                  variant={
                    selectedMenu === item.value ? "contained" : "outlined"
                  }
                  size="small"
                  onClick={() => handleMenuClick(item.value)}
                  disabled={
                    item?.value?.toLowerCase() != "basic" &&
                    studentRecord?.affiliatedTo?.toLowerCase() != "hca"
                  }
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* divider */}
          <Divider style={{ margin: ".8rem 0" }} />

          <div className="flex-1 h-full flex  overflow-y-auto">
            {showComponent()}
          </div>
        </div>
      )}
      {/* user attendance chart */}
      <div className="userattendancechart w-[35%] h-full flex flex-col justify-between ">
        <StudentAttendance studentRecord={studentRecord} />
      </div>
    </div>
  );
};

export default ViewStudent;
