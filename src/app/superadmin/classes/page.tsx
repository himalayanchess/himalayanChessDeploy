"use client";
import AssignClass from "@/components/classes/AssignClass";
import SelectBatch from "@/components/classes/SelectBatch";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import React, { useState } from "react";

const page = () => {
  const [selectedBatch, setselectedBatch] = useState(true);
  return (
    <div>
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Classes"
      />
      <div className="ml-[3rem] w-[97%]">
        <Header />
        <div className="pb-6 h-[92dvh] flex py-5 px-14 ">
          {/* assignClass */}
          <div className="assign-class flex-1 flex p-5  rounded-lg bg-white">
            <AssignClass selectedBatch={selectedBatch} />
          </div>
          {/* select batch */}
          <div className="selectBatch flex-[0.3] flex flex-col ml-4  p-5 rounded-lg bg-white">
            <SelectBatch
              selectedBatch={selectedBatch}
              setselectedBatch={setselectedBatch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
