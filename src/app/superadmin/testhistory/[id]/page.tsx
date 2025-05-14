"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import { useSession } from "next-auth/react";
import ViewTestRecord from "@/components/testhistory/ViewTestRecord";

const page = ({ params }: any) => {
  const { id: testRecordId }: any = use(params);
  const session = useSession();

  const [loading, setLoading] = useState(false);
  const [invalidId, setInvalidId] = useState(false);
  const [testRecord, setTestRecord] = useState<any>(null);

  async function getTestRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/testhistory/getTestRecord ",
        { testRecordId }
      );
      setTestRecord(resData.testRecord);

      if (resData?.statusCode == 204) {
        setInvalidId(true);
      }
      setLoading(false);
    } catch (error) {}
  }

  useEffect(() => {
    getTestRecord();
  }, [testRecordId]);

  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        role="Superadmin"
        activeMenu="Test Records"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh] py-5 px-14 ">
          {loading || !testRecordId ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading test record...</span>
            </div>
          ) : invalidId ? (
            <p>Invalid test record id</p>
          ) : (
            <ViewTestRecord
              testRecord={testRecord}
              role={session?.data?.user?.role}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
