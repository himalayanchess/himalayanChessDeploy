"use client";
import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BatchComponent from "@/components/batch/BatchComponent";
import { useSession } from "next-auth/react";
import LichessWeeklyTournamentComponent from "@/components/tournaments/lichessweeklytournaments/LichessWeeklyTournamentComponent";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";

const page = () => {
  const session = useSession();
  return (
    <div className="">
      <Sidebar
        role="Admin"
        menuItems={adminMenuItems}
        activeMenu="Tournaments"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh]  flex flex-col py-5 px-14 ">
          <LichessWeeklyTournamentComponent />
        </div>
      </div>
    </div>
  );
};

export default page;
