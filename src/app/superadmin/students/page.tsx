"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StudentComponent from "@/components/student/StudentComponent";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const session = useSession();
  return (
    <div className="">
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Students"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        {/* main component */}
        <div className="pb-6 h-[91dvh]  flex flex-col py-5 px-14 ">
          <StudentComponent role={session?.data?.user?.role} />
        </div>
      </div>
    </div>
  );
};

export default page;
