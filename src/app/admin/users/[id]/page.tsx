"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import ViewUserDetail from "@/components/user/ViewUserDetail";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";

const page = ({ params }: any) => {
  const { id: userId }: any = use(params);

  const [loading, setLoading] = useState(true);
  const [userRecord, setuserRecord] = useState<any>(null);
  console.log("ac record", userRecord);

  async function getuserRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post("/api/users/getUser", {
        userId,
      });
      setuserRecord(resData.userRecord);
      console.log(resData);
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
        menuItems={adminMenuItems}
        // role={session?.data?.user.role}
        role="Admin"
        activeMenu="Users"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          <ViewUserDetail userRecord={userRecord} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default page;
