"use client";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import CourseComponent from "@/components/course/CourseComponent";
import { useSession } from "next-auth/react";

const Users = () => {
  const session = useSession();
  return (
    <div className="">
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Courses"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-14 ">
          <CourseComponent role={session?.data?.user?.role} />
        </div>
      </div>
    </div>
  );
};

export default Users;
