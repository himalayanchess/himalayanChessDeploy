import React from "react";
import HCATransparent from "@/images/hca-transparent.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Avatar } from "@mui/material";
const Header = () => {
  const { data } = useSession();

  return (
    <div className="h-[8dvh]  px-14 flex justify-between items-center">
      <div className="logo">
        <Image alt="hca" height={40} src={HCATransparent} />
      </div>
      <div className="user-details text-right flex">
        <div className="user-info">
          <p className="font-bold text-">{data?.user?.name}</p>
          <p className="text-xs">{data?.user?.role}</p>
        </div>
        <Avatar className="ml-2">S</Avatar>
      </div>
    </div>
  );
};

export default Header;
