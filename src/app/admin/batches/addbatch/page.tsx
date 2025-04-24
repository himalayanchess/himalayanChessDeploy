"use client";
import AddBatch from "@/components/batch/AddBatch";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AddUser from "@/components/user/AddUser";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import React from "react";

const page = () => {
  return (
    <div>
      <Sidebar
        menuItems={adminMenuItems}
        // role={session?.data?.user.role}
        role="admin"
        activeMenu="Batches"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh]  flex py-5 px-14 ">
          <AddBatch />
        </div>
      </div>
    </div>
  );
};

export default page;
