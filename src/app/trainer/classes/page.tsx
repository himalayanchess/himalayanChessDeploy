"use client";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AddUser from "@/components/user/AddUserPageBased";
import AddCourse from "@/components/course/AddCourse";
import Header from "@/components/Header";
import { trainerMenuItems } from "@/sidebarMenuItems/trainerMenuItems";
import TrainerClasses from "@/components/trainer/trainerclasses/TrainerClasses";
const page = () => {
  const router = useRouter();
  const session = useSession();
  console.log(session);

  return (
    <div>
      <Sidebar
        menuItems={trainerMenuItems}
        // role={session?.data?.user.role}
        role="trainer"
        activeMenu="Classes"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh] flex py-5 px-14 ">
          <TrainerClasses />
        </div>
      </div>
    </div>
  );
};

export default page;
