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
import { useDispatch, useSelector } from "react-redux";
import { fetchAllActivityRecords } from "@/redux/activityRecordSlice";
import { useSession } from "next-auth/react";

const page = ({ params }: any) => {
  const { id: projectId }: any = use(params);

  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [projectRecord, setprojectRecord] = useState<any>(null);

  async function getprojectRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post("/api/projects/getProject", {
        projectId,
      });
      setprojectRecord(resData.projectRecord);

      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {}
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getprojectRecord();

    dispatch(fetchAllActivityRecords());
  }, [projectId]);

  if (!isSuperOrGlobalAdmin) {
    return <div>No access</div>;
  }

  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Schools"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          {loading || !projectId ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId ? (
            <p>Invalid user id</p>
          ) : (
            <ViewProject projectRecord={projectRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
