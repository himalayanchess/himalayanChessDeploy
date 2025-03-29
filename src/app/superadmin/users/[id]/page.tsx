"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import ViewUserDetail from "@/components/user/ViewUserDetail";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";

const page = ({ params }: any) => {
  const { id: userId }: any = use(params);

  const [loading, setLoading] = useState(true);
  const [invalidId, setinvalidId] = useState(false);

  const [userRecord, setuserRecord] = useState<any>(null);
  // console.log("ac record", userRecord);

  async function getuserRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post("/api/users/getUser", {
        userId,
      });
      setuserRecord(resData.userRecord);
      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {
      console.log("error in traierhistory : [id], getuserRecord api", error);
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getuserRecord();
  }, [userId]);
  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Users"
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
            <p>Invalid user id</p>
          ) : (
            <ViewUserDetail userRecord={userRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
