"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import ViewProject from "@/components/project/ViewProject";
import ViewBatch from "@/components/batch/ViewBatch";
import ViewLeaveRequest from "@/components/trainer/leaverequest/ViewLeaveRequest";
import { useSession } from "next-auth/react";
import { trainerMenuItems } from "@/sidebarMenuItems/trainerMenuItems";

const page = ({ params }: any) => {
  const { id: leaveRequestId }: any = use(params);

  const session = useSession();

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [leaveRequestRecord, setleaveRequestRecord] = useState<any>(null);

  async function getleaveRequestRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/leaverequest/getLeaveRequest",
        {
          leaveRequestId,
        }
      );
      setleaveRequestRecord(resData.leaveRequestRecord);

      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(
        "error in updatebatch : [id], getleaveRequestRecord api",
        error
      );
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getleaveRequestRecord();
  }, [leaveRequestId]);

  return (
    <div>
      <Sidebar
        menuItems={trainerMenuItems}
        // role={session?.data?.user.role}
        role="Trainer"
        activeMenu="Leave Request"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          {loading || !leaveRequestId ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId ? (
            <p>Invalid leave request id</p>
          ) : (
            <ViewLeaveRequest
              leaveRequestRecord={leaveRequestRecord}
              role={session?.data?.user?.role}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
