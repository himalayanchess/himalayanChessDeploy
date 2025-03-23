"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TrainerHistory from "@/components/trainer/trainerhistory/TrainerHistory";
import { trainerMenuItems } from "@/sidebarMenuItems/trainerMenuItems";
import React from "react";

const page = () => {
  return (
    <div>
      <Sidebar
        menuItems={trainerMenuItems}
        // role={session?.data?.user.role}
        role="trainer"
        activeMenu="History"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-14 ">
          <TrainerHistory />
        </div>
      </div>
    </div>
  );
};

export default page;
