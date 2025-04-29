"use client";
import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import ActivityRecordComponent from "@/components/activityrecord/ActivityRecordComponent";
import PaymentComponent from "@/components/payments/PaymentComponent";

const page = () => {
  return (
    <div className="">
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Payments"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh]  flex flex-col py-5 px-14 ">
          {/* <ActivityRecordComponent /> */}
          <PaymentComponent />
        </div>
      </div>
    </div>
  );
};

export default page;
