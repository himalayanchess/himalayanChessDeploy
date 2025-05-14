"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";

import TrainerHistory from "@/components/trainer/trainerhistory/TrainerHistory";
import ViewActivityRecordDetail from "@/components/activityrecord/ViewActivityRecordDetail";
import { trainerMenuItems } from "@/sidebarMenuItems/trainerMenuItems";
import axios from "axios";
import React, { use, useEffect, useState } from "react";

const page = ({ params }: any) => {
  const { id: activityRecordId }: any = use(params);

  const [loading, setLoading] = useState(true);
  const [activityRecord, setactivityRecord] = useState<any>(null);

  async function getActivityRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/activityrecord/getActivityRecord",
        { activityRecordId }
      );
      setactivityRecord(resData.activityRecord);

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
    getActivityRecord();
  }, [activityRecordId]);
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
            <ViewActivityRecordDetail activityRecord={activityRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
