"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LeaveRequest from "@/components/trainer/leaverequest/LeaveRequest";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const session = useSession();
  return (
    <div>
      <Sidebar
        menuItems={adminMenuItems}
        // role={session?.data?.user.role}
        role="Admin"
        activeMenu="Leave Request"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-20 ">
          <LeaveRequest role={session?.data?.user?.role} />
        </div>
      </div>
    </div>
  );
};

export default page;
