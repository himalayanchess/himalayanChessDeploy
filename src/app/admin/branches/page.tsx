"use client";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import { useSession } from "next-auth/react";
import BranchComponent from "@/components/branches/BranchComponent";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";

const Users = () => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  return (
    <div className="">
      <Sidebar role="Admin" menuItems={adminMenuItems} activeMenu="Branches" />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-14 ">
          {isSuperOrGlobalAdmin ? (
            <BranchComponent role={session?.data?.user?.role} />
          ) : (
            <p>No access</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
