"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import { Home, Settings, User } from "lucide-react";

const menuItems = [
  { icon: <Home />, label: "Admin " },
  { icon: <User />, label: "Profile" },
  {
    icon: <Settings />,
    label: "Settings",
    hasDropdown: true,
    options: ["Account", "Privacy"],
  },
];
const page = () => {
  return (
    <>
      <Sidebar menuItems={menuItems} role="Admin" />
      <div className="ml-[4rem]">admin</div>
    </>
  );
};

export default page;
