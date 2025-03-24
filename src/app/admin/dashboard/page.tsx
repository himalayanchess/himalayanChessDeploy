"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import { Home, Settings, User } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard " },
  { icon: User, label: "Profile" },
];
const page = () => {
  return (
    <>
      <Sidebar menuItems={menuItems} role="admin" activeMenu="Dashboard" />
      <div className="ml-[4rem]">admin</div>
    </>
  );
};

export default page;
