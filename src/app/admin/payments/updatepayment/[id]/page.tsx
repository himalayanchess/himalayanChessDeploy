"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";

import TrainerHistory from "@/components/trainer/trainerhistory/TrainerHistory";
import ViewActivityRecordDetail from "@/components/activityrecord/ViewActivityRecordDetail";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import UpdatePayment from "@/components/payments/UpdatePayment";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";

const page = ({ params }: any) => {
  const { id: paymentRecordId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [paymentRecord, setpaymentRecord] = useState<any>(null);

  async function getpaymentRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/payments/getPaymentRecord",
        {
          paymentRecordId,
        }
      );
      setpaymentRecord(resData.paymentRecord);
      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(
        "error in udpate payment record : [id], getpaymentRecord api",
        error
      );
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getpaymentRecord();
  }, [paymentRecordId]);
  return (
    <div>
      <Sidebar
        menuItems={adminMenuItems}
        // role={session?.data?.user.role}
        role="Admin"
        activeMenu="Payment"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          {loading ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId ? (
            <p>Invalid student id</p>
          ) : (
            // <UpdatePayment paymentRecord={paymentRecord} />
            <p>No access</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
