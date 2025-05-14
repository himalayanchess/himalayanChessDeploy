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

    let redirectRoute = "/login";
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

    router.push(redirectRoute);
  }
  useEffect(() => {
    checkAuthorization();
  }, []);
  return <div></div>;
}
