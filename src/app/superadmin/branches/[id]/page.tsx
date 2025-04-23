"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";

import TrainerHistory from "@/components/trainer/trainerhistory/TrainerHistory";
import ViewActivityRecordDetail from "@/components/activityrecord/ViewActivityRecordDetail";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import UpdateProject from "@/components/project/UpdateProject";
import ViewProject from "@/components/project/ViewProject";
import ViewCourse from "@/components/course/ViewCourse";
import ViewBranch from "@/components/branches/ViewBranch";

const page = ({ params }: any) => {
  const { id: branchId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [branchRecord, setbranchRecord] = useState<any>(null);

  async function getbranchRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post("/api/branches/getBranch", {
        branchId,
      });
      setbranchRecord(resData.branchRecord);

      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {
      console.log("error in viewbranch : [id], getbranchRecord api", error);
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getbranchRecord();
  }, [branchId]);
  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Branches"
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
            <p>Invalid branch id</p>
          ) : (
            <ViewBranch branchRecord={branchRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
