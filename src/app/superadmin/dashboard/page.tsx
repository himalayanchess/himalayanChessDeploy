"use client";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AddUser from "@/components/user/AddUserPageBased";
import AddCourse from "@/components/course/AddCourse";
import Header from "@/components/Header";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
const page = () => {
  const router = useRouter();
  const session = useSession();
  console.log(session);

  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Dashboard"
      />
      <main className="ml-[3rem] w-[96%]  min-h-[100dvh] ">
        <Header />
        <div className="dashboard-container py-6 px-14">Dashboard</div>
      </main>
    </div>
  );
};

export default page;
