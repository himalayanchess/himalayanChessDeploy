"use client";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Home, Settings, User } from "lucide-react";
import AddUser from "@/components/user/AddUser";
import AddCourse from "@/components/course/AddCourse";
import Header from "@/components/Header";

const page = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const menuItems = [
    { icon: <Home />, label: "Users" },
    { icon: <User />, label: "Add Course" },
    {
      icon: <Settings />,
      label: "Settings",
      hasDropdown: true,
      options: ["Account", "Privacy"],
    },
  ];

  const [activeComponent, setActiveComponent] = useState(menuItems[0].label);
  async function checkAuthorization() {
    const session = await getSession();
    const role = session?.user.role;
    if (role == "Superadmin") {
      setAuthorized(true);
    } else {
      router.push("/");
    }
  }
  // render component
  const renderComponent = () => {
    switch (activeComponent) {
      case "Add User":
        return <AddUser />;
      case "Add Course":
        return <AddCourse />;
      default:
        return <AddUser />;
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, []);
  if (!authorized) {
    return <div></div>;
  } else {
    return (
      <div>
        <Sidebar
          menuItems={menuItems}
          setActiveComponent={setActiveComponent}
        />
        <main className="ml-[3rem] w-[96%]  min-h-[100dvh] ">
          <Header />
          {renderComponent()}
        </main>
      </div>
    );
  }
};

export default page;
