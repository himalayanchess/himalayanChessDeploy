"use client";
import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import UsersComponent from "@/components/user/UsersComponent";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import { useSession } from "next-auth/react";

const Users = () => {
  const session = useSession();
  return (
    <div className="">
      <Sidebar role="Admin" menuItems={adminMenuItems} activeMenu="Users" />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-14 ">
          <UsersComponent role={session?.data?.user?.role} />
        </div>
      </div>
    </div>
  );
};

export default Users;
