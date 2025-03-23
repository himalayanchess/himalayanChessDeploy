"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";

import TrainerHistory from "@/components/trainer/trainerhistory/TrainerHistory";
import ViewActivityRecordDetail from "@/components/trainer/trainerhistory/ViewActivityRecordDetail";
import { trainerMenuItems } from "@/sidebarMenuItems/trainerMenuItems";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import UpdateStudent from "@/components/student/UpdateStudent";

const page = ({ params }: any) => {
  const { id: studentId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [studentRecord, setstudentRecord] = useState<any>(null);

  async function getStudentRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post("/api/students/getStudent", {
        studentId,
      });
      setstudentRecord(resData.studentRecord);
      console.log(resData);
      setLoading(false);
    } catch (error) {
      console.log(
        "error in traierhistory : [id], getActivityRecord api",
        error
      );
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getStudentRecord();
  }, [studentId]);
  return (
    <div>
      <Sidebar
        menuItems={trainerMenuItems}
        // role={session?.data?.user.role}
        role="trainer"
        activeMenu="History"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          {loading ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : (
            <UpdateStudent studentRecord={studentRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
