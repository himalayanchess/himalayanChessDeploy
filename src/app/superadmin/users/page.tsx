"use client";
import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import UsersComponent from "@/components/user/UsersComponent";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";

const Users = () => {
  return (
    <div className="">
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Users"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-14 ">
          <UsersComponent />
        </div>
      </div>
    </div>
  );
};

export default Users;
