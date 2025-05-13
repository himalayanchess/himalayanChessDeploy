"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AddHcaCircuitTournament from "@/components/tournaments/hcacircuit/AddHcaCircuitTournament";
import AddLichessWeeklyTournaments from "@/components/tournaments/lichessweeklytournaments/AddLichessWeeklyTournament";
import AddOtherTournament from "@/components/tournaments/othertournaments/AddOtherTournament";
import AddUser from "@/components/user/AddUser";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import React from "react";

const page = () => {
  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Tournaments"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh]  flex py-5 px-14 ">
          <AddHcaCircuitTournament />
        </div>
      </div>
    </div>
  );
};

export default page;
