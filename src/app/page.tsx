"use client";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  async function checkAuthorization() {
    const session = await getSession();
    const role = session?.user.role;
    console.log("session role ", session);

    let redirectRoute = "/";
    switch (session?.user?.role?.toLowerCase()) {
      case "superadmin":
        redirectRoute = "/superadmin/dashboard";
        break;
      case "admin":
        redirectRoute = "/admin/dashboard";
        break;
      case "trainer":
        redirectRoute = "/trainer/dashboard";
        break;
      default:
        break;
    }
    console.log(redirectRoute);
    router.push(redirectRoute);
  }
  useEffect(() => {
    checkAuthorization();
  }, []);
  return <div></div>;
}
