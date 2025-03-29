"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AddStudent from "@/components/student/AddStudent";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import React from "react";

const page = () => {
  return (
    <div>
      <Sidebar
        menuItems={adminMenuItems}
        // role={session?.data?.user.role}
        role="Admin"
        activeMenu="Students"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh]  flex py-5 px-14 ">
          <AddStudent />
        </div>
      </div>
    </div>
  );
};

export default page;
