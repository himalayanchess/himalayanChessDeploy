"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import UpdateUser from "@/components/user/UpdateUser";
import UpdateBatch from "@/components/batch/UpdateBatch";
import UpdateTestRecord from "@/components/testhistory/UpdateTestRecord";

const page = ({ params }: any) => {
  const { id: testRecordId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [testRecord, settestRecord] = useState<any>(null);

  async function gettestRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/testhistory/getTestRecord",
        {
          testRecordId,
        }
      );
      settestRecord(resData.testRecord);

      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(
        "error in update test record : [id], gettestRecord api",
        error
      );
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    gettestRecord();
  }, [testRecordId]);
  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Test History"
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
            <p>Invalid test record id</p>
          ) : (
            <UpdateTestRecord testRecord={testRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
