"use client";
import AssignClass from "@/components/classes/AssignClass";
import SelectBatch from "@/components/classes/SelectBatch";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import React, { useState } from "react";

const page = () => {
  return (
    <div>
      <Sidebar
        role="Admin"
        menuItems={adminMenuItems}
        activeMenu="Assign Class"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw]">
        <Header />
        <div className="h-[91dvh] flex py-5 px-14 ">
          {/* assignClass */}
          <div className="assign-class flex-1 flex p-5  rounded-lg bg-white">
            <AssignClass />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
