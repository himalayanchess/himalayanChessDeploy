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
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents } from "@/redux/allListSlice";
import BatchStudentList from "./BatchStudentList";
import BatchStudentsInfo from "./batchdetails/BatchStudentsInfo";
import BasicBatchInfo from "./batchdetails/BasicBatchInfo";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSession } from "next-auth/react";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewBatch = ({ batchRecord }: any) => {
  const dispatch = useDispatch<any>();
  const session = useSession();

  // console.log(batchRecord);
  const { allActiveStudentsList } = useSelector(
    (state: any) => state.allListReducer
  );

  //state vars
  const [loaded, setLoaded] = useState(false);
  const [selectedStudentStatus, setselectedStudentStatus] = useState("all");
  const [filteredStudentList, setfilteredStudentList] = useState([]);
  const [studentCount, setstudentCount] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });
  const [selectedMenu, setSelectedMenu] = useState("basic");

  const handleMenuClick = (menuValue: any) => {
    setSelectedMenu(menuValue); // Update the selected menu
  };

  const menuItems = [
    { label: "Overview", value: "basic", icon: <InfoOutlinedIcon /> },
    {
      label: "Students",
      value: "students",
      icon: <PeopleAltOutlinedIcon />,
    },
  ];

  const showComponent = () => {
    if (batchRecord) {
      console.log("show comp", selectedMenu);

      switch (selectedMenu) {
        case "basic":
          return <BasicBatchInfo batchRecord={batchRecord} />;
        case "students":
          return (
            <BatchStudentsInfo
              batchRecord={batchRecord}
              allActiveStudentsList={allActiveStudentsList}
            />
          );
        default:
          return <BasicBatchInfo batchRecord={batchRecord} />;
      }
    }
  };
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
      <div className="header flex flex-col">
        <div className="title-home flex justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Component />
            <span className="ml-2">Batch Details</span>
          </h1>

          {/* home button */}
          <Link href={`/${session?.data?.user?.role?.toLowerCase()}/batches`}>
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
        <div className="w-full menuButtons mt-2 flex  gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.value}
              variant={selectedMenu === item.value ? "contained" : "outlined"}
              size="medium"
              onClick={() => handleMenuClick(item.value)}
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
  );
};

export default ViewBatch;
