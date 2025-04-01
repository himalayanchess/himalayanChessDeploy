"use client";
import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import BatchComponent from "@/components/batch/BatchComponent";
import { useSession } from "next-auth/react";
import AdminAttendanceComponent from "@/components/superadmin/adminattendance/AdminAttendanceComponent";

const Batch = () => {
  const session = useSession();
  return (
    <div className="">
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Admin Attendance"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh]  flex flex-col py-5 px-14 ">
          <AdminAttendanceComponent />
        </div>
      </div>
    </div>
  );
};

export default Batch;
