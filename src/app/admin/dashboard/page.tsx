"use client";
import React, from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

import Header from "@/components/Header";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
const page = () => {
  const router = useRouter();
  const session = useSession();
  console.log(session);

  return (
    <div>
      <Sidebar
        menuItems={adminMenuItems}
        // role={session?.data?.user.role}
        role="admin"
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
