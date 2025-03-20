"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LeaveRequest from "@/components/trainer/leaverequest/LeaveRequest";
import { trainerMenuItems } from "@/sidebarMenuItems/trainerMenuItems";
import React from "react";

const page = () => {
  return (
    <div>
      <Sidebar
        menuItems={trainerMenuItems}
        // role={session?.data?.user.role}
        role="trainer"
        activeMenu="Leave Request"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-20 ">
          <LeaveRequest />
        </div>
      </div>
    </div>
  );
};

export default page;
