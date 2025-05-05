"use client";
import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ActivityRecordComponent from "@/components/activityrecord/ActivityRecordComponent";
import PaymentComponent from "@/components/payments/PaymentComponent";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";

const page = () => {
  return (
    <div className="">
      <Sidebar role="Admin" menuItems={adminMenuItems} activeMenu="Payments" />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh]  flex flex-col py-5 px-14 ">
          {/* <PaymentComponent /> */}
          <p>No access</p>
        </div>
      </div>
    </div>
  );
};

export default page;
