// import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpenCheck,
  CircleUser,
  Users,
  BookCopy,
  School,
  Component,
  Luggage,
  LayoutList,
  CircleFadingArrowUp,
  CalendarCheck2,
  Edit,
} from "lucide-react";
import { Button, Divider } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
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
import { fetchAllStudentsTestHistory } from "@/redux/testHistorySlice";
import { getAllSelectedStudentsPaymentRecords } from "@/redux/allListSlice";
import { fetchAllSelectedStudentsLichessTournaments } from "@/redux/allTournamentSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewStudent = ({ studentRecord, loading }: any) => {
  // birthday
  const isBirthday = studentRecord?.dob
    ? dayjs(studentRecord.dob).tz(timeZone).format("MM-DD") ==
      dayjs().tz(timeZone).format("MM-DD")
    : false;

  const session = useSession();

  const {
    allActiveStudentsActivityRecords,
    allStudentsActivityRecordsLoading,
  } = useSelector((state: any) => state.activityRecordReducer);

  //tournament slices
  const {
    //selected students lichess tournaments
    allActiveSelectedStudentsLichessTournamentsList,
    allSelectedStudentsLichessTournamentsLoading,
  } = useSelector((state: any) => state.allTournamentReducer);

  // use use selectro for students test history
  const { allActiveStudentsTestHistory, allStudentsTestHistoryLoading } =
    useSelector((state: any) => state.testHistoryReducer);
  //use selector for students payment
  const {
    allActiveSelectedStudentsPaymentRecordsList,
    allFilteredActiveSelectedStudentsPaymentRecordsList,
    allSelectedStudentsPaymentRecordsLoading,
  } = useSelector((state: any) => state.allListReducer);
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
    { label: "Overview", value: "basic", icon: <InfoOutlinedIcon /> },
    {
      label: "Batches",
      value: "batches",
      icon: <Component />,
    },
    { label: "Courses", value: "courses", icon: <BookOpenCheck /> },
    {
      label: "Test History",
      value: "testhistory",
      icon: <HistoryOutlinedIcon />,
    },
    { label: "Records", value: "activity", icon: <LayoutList /> },
    ...(session?.data?.user?.role?.toLowerCase() === "superadmin"
      ? [
          {
            label: "Payment",
            value: "payment",
            icon: <AttachMoneyOutlinedIcon />,
          },
        ]
      : []),
    {
      label: "Tournaments",
      value: "events",
      icon: <EmojiEventsOutlinedIcon />,
    },
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
          return (
            <StudentTestHistory
              studentRecord={studentRecord}
              allActiveStudentsTestHistory={allActiveStudentsTestHistory}
              allStudentsTestHistoryLoading={allStudentsTestHistoryLoading}
            />
          );
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
          return (
            <StudentPayment
              allActiveSelectedStudentsPaymentRecordsList={
                allActiveSelectedStudentsPaymentRecordsList
              }
              allFilteredActiveSelectedStudentsPaymentRecordsList={
                allFilteredActiveSelectedStudentsPaymentRecordsList
              }
              allSelectedStudentsPaymentRecordsLoading={
                allSelectedStudentsPaymentRecordsLoading
              }
            />
          );
        case "events":
          return (
            <StudentEventInfo
              studentRecord={studentRecord}
              // lichess
              studentsLichessTournamentsList={
                allActiveSelectedStudentsLichessTournamentsList
              }
              studentsLichessTournamentsLoading={
                allSelectedStudentsLichessTournamentsLoading
              }
            />
          );
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
      dispatch(fetchAllStudentsTestHistory(studentRecord?._id));
    }
  }, [studentRecord]);

  // fetch initial data for student payment
  useEffect(() => {
    if (studentRecord) {
      dispatch(getAllSelectedStudentsPaymentRecords(studentRecord?._id));
      dispatch(fetchAllSelectedStudentsLichessTournaments(studentRecord?._id));
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
            <div className="title-home w-full flex justify-between ">
              <div className="title flex flex-col">
                <h1 className="text-2xl font-bold flex items-center">
                  <Users />
                  <span className="ml-2 mr-3">Student Detail </span>
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/students/updatestudent/${
                      studentRecord?._id
                    }`}
                    className="mr-3"
                  >
                    <Button variant="text" size="small">
                      <Edit />
                      <span className="ml-1">Edit</span>
                    </Button>
                  </Link>
                  {isBirthday && (
                    <span className="ml-3 font-medium">
                      (🎉 Birthday
                      {studentRecord?.gender?.toLowerCase() === "male"
                        ? " boy"
                        : studentRecord?.gender?.toLowerCase() === "female"
                        ? " girl"
                        : ""}
                      )
                    </span>
                  )}
                </h1>
                <p>of {studentRecord?.name}</p>
              </div>
              {/* home button */}
              <Link
                href={`/${session?.data?.user?.role?.toLowerCase()}/students`}
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

            {/* menu buttons */}
            <div className="w-full menuButtons flex  gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.value}
                  variant={
                    selectedMenu === item.value ? "contained" : "outlined"
                  }
                  size="medium"
                  onClick={() => handleMenuClick(item.value)}
                  disabled={
                    item?.value?.toLowerCase() != "basic" &&
                    studentRecord?.affiliatedTo?.toLowerCase() != "hca"
                  }
                  sx={{ padding: "0.3rem 0.7rem" }}
                >
                  {item.icon}
                  <span className="ml-1.5">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* divider */}
          <Divider style={{ margin: ".7rem 0" }} />

          <div className="flex-1 h-full flex  overflow-y-auto">
            {showComponent()}
          </div>
        </div>
      )}
      {/* user attendance chart right side*/}
      <div className="userattendancechart w-[35%]  h-full flex flex-col justify-between ">
        <StudentAttendance studentRecord={studentRecord} />
      </div>
    </div>
  );
};

export default ViewStudent;
