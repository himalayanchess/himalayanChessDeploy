"use client";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProjectComponent from "@/components/project/ProjectComponent";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import { useSession } from "next-auth/react";

const Projects = () => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  return (
    <div className="">
      <Sidebar role="Admin" menuItems={adminMenuItems} activeMenu="Schools" />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-14 ">
          {isSuperOrGlobalAdmin ? (
            <ProjectComponent role={session?.data?.user?.role} />
          ) : (
            <p>No access</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
