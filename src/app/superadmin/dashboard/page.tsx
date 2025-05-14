"use client";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AddUser from "@/components/user/AddUserPageBased";
import AddCourse from "@/components/course/AddCourse";
import Header from "@/components/Header";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import DashboardComponent from "@/components/dashboard/DashboardComponent";
const page = () => {
  const router = useRouter();
  const session = useSession();

  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Dashboard"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <DashboardComponent />
      </div>
    </div>
  );
};

export default page;
