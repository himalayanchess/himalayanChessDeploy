"use client";
import AddCourse from "@/components/course/AddCourse";
import Header from "@/components/Header";
import AddPayment from "@/components/payments/AddPayment";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import React from "react";

const page = () => {
  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Payment"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh]  flex py-5 px-14 ">
          <AddPayment />
        </div>
      </div>
    </div>
  );
};

export default page;
