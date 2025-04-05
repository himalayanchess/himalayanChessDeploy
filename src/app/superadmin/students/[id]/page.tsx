"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import UpdateUser from "@/components/user/UpdateUser";
import UpdateBatch from "@/components/batch/UpdateBatch";
import ViewStudent from "@/components/student/ViewStudent";

const page = ({ params }: any) => {
  const { id: studentId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [studentRecord, setstudentRecord] = useState<any>(null);

  async function getstudentRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post("/api/students/getStudent", {
        studentId,
      });
      setstudentRecord(resData.studentRecord);

      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {
      console.log("error in updatestudent : [id], getstudentRecord api", error);
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getstudentRecord();
  }, [studentId]);
  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Students"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          {loading ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId ? (
            <p>Invalid student id</p>
          ) : (
            <ViewStudent studentRecord={studentRecord} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
