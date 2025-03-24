"use client";
import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LeaveApproval from "@/components/superadmin/leaveapproval/LeaveApproval";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";

const page = () => {
  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Leave Approval"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-14 ">
          <LeaveApproval />
        </div>
      </div>
    </div>
  );
};

export default page;
