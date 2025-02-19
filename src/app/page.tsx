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
    let redirectRoute = "/";
    switch (session?.user?.role) {
      case "Superadmin":
        redirectRoute = "/superadmin/dashboard";
        break;
      case "Admin":
        redirectRoute = "/admin/dashboard";
        break;
      case "Trainer":
        redirectRoute = "/trainer/dashboard";
        break;
      case "Student":
        redirectRoute = "/student/dashboard";
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
