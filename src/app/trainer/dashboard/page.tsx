"use client";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AddUser from "@/components/user/AddUserPageBased";
import AddCourse from "@/components/course/AddCourse";
import Header from "@/components/Header";
import { trainerMenuItems } from "@/sidebarMenuItems/trainerMenuItems";
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
      <main className="ml-[3rem] w-[96%]  min-h-[100dvh] ">
        <Header />
        <div className="dashboard-container py-6 px-14">Trainer Dashboard</div>
      </main>
    </div>
  );
};

export default page;
