"use client";
import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import { useSession } from "next-auth/react";
import TournamentsOrganizedByHcaComponent from "@/components/tournaments/tournamentsorganizedbyhca/TournamentsOrganizedByHcaComponent";
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
          <TournamentsOrganizedByHcaComponent />
        </div>
      </div>
    </div>
  );
};

export default page;
