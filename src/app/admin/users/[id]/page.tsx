"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import ViewUserDetail from "@/components/user/ViewUserDetail";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import { useSession } from "next-auth/react";

const page = ({ params }: any) => {
  const { id: userId }: any = use(params);
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  const [loading, setLoading] = useState(true);
  const [userRecord, setuserRecord] = useState<any>(null);

  async function getuserRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post("/api/users/getUser", {
        userId,
      });
      setuserRecord(resData.userRecord);

      setLoading(false);
    } catch (error) {
      setLoading(false); // Ensure loading is set to false in case of an error.
    }
  }

  useEffect(() => {
    getuserRecord();
  }, [userId]);

  return (
    <div>
      <Sidebar menuItems={adminMenuItems} role="Admin" activeMenu="Users" />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          {loading ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
          ) : (
            <>
              {isSuperOrGlobalAdmin ||
              (userRecord?.branchId === session?.data?.user?.branchId &&
                userRecord?.branchName === session?.data?.user?.branchName) ? (
                <ViewUserDetail userRecord={userRecord} loading={loading} />
              ) : (
                <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7">
                  No access
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
