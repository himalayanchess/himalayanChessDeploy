"use client";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AddUser from "@/components/user/AddUserPageBased";
import AddCourse from "@/components/course/AddCourse";
import Header from "@/components/Header";
import DashboardComponent from "@/components/dashboard/DashboardComponent";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import { trainerMenuItems } from "@/sidebarMenuItems/trainerMenuItems";
import TrainerDashboardComponent from "@/components/trainer/dashboard/TrainerDashboardComponent";
const page = () => {
  const router = useRouter();
  const session = useSession();
  console.log(session);

  return (
    <div>
      <Sidebar
        menuItems={trainerMenuItems}
        // role={session?.data?.user.role}
        role="trainer"
        activeMenu="Dashboard"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <TrainerDashboardComponent />
      </div>
    </div>
  );
};

export default page;
