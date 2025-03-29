import React, { useEffect, useRef, useState } from "react";
import HCATransparent from "@/images/hca-transparent.png";
import Image from "next/image";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThreeDots } from "react-loading-icons"; // Importing ThreeDots loader

import { signOut, useSession } from "next-auth/react";
import { Box, Button, Modal } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Header = () => {
  const router = useRouter();

  const session = useSession();

  const [signoutModalOpen, setsignoutModalOpen] = useState(false);
  const [showDropdownOptions, setshowDropdownOptions] = useState(false);

  const dropdownRef = useRef<any>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setshowDropdownOptions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[9dvh] shadow-sm px-14 bg-white flex justify-between items-center">
      <div className="logo flex items-center">
        <Image
          alt="hca"
          className="w-[30px] h-auto"
          src={HCATransparent}
          priority
        />
        <div className="logo-title ml-3 flex flex-col   items-start justify-center font-bold">
          <p className="w-full text-sm tracking-[0.2rem]">HIMALAYAN</p>
          <p className="w-full text-xs tracking-wider">CHESS ACADEMY</p>
        </div>
      </div>
      <div className="user-details text-right flex z-40" ref={dropdownRef}>
        {session?.data?.user ? (
          <div className="loggedin-user relative">
            <button
              onClick={() => setshowDropdownOptions((prev) => !prev)}
              className="user-info flex items-start"
            >
              <div className="info flex flex-col items-end">
                <p className="font-bold text-">
                  Hi, {session?.data?.user?.name}
                </p>
                <p className="text-xs bg-gray-500 rounded-full font-semibold text-white px-3 py-1">
                  {session?.data?.user?.role}
                </p>
              </div>
              <ArrowDropDownIcon />
            </button>

            <div
              className={`dropdown-options ${
                showDropdownOptions ? "flex" : "hidden"
              } absolute top-[9vh]  flex-col rounded-md shadow-md w-[185px] py-2 bg-white`}
            >
              {/* change password */}
              <Link
                href={`/${session?.data?.user?.role?.toLowerCase()}/changepassword`}
                className="px-4 py-2 w-full text-left flex items-center justify-start border-b hover:bg-gray-200"
              >
                <SettingsSuggestIcon sx={{ fontSize: "1.4rem" }} />
                <span className="ml-2 text-sm">Change password</span>
              </Link>
              {/* logout */}
              <button
                onClick={() => setsignoutModalOpen(true)}
                className={`px-4 py-2 w-full text-left flex items-center justify-start hover:bg-gray-200`}
              >
                <LogoutIcon sx={{ fontSize: "1.4rem" }} />
                <span className="ml-2 text-sm">Log out</span>
              </button>

              <Modal
                open={signoutModalOpen}
                onClose={() => {
                  setsignoutModalOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
              >
                <Box className="w-[400px] py-7 text-center rounded-lg bg-white">
                  <>
                    <p className="poppins font-bold text-2xl ">
                      Logout Confirmation
                    </p>
                    <p className="text-sm poppins mt-2 mb-7 text-gray-500">
                      Are you sure you want to logout?
                    </p>
                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        variant="contained"
                        size="medium"
                        color="error"
                        onClick={async () => {
                          console.log("logout");

                          await signOut({ redirect: false });
                          router.push("/login");
                        }}
                        sx={{ marginRight: ".5rem", paddingInline: "1.5rem" }}
                      >
                        {/* <DeleteForeverOutlinedIcon /> */}
                        Logout
                      </Button>
                      <Button
                        variant="outlined"
                        size="medium"
                        onClick={() => {
                          setsignoutModalOpen(false);
                        }}
                        sx={{ marginLeft: ".5rem", paddingInline: "1.5rem" }}
                      >
                        {/* <ClearOutlinedIcon /> */}
                        Cancel
                      </Button>
                    </div>
                  </>
                </Box>
              </Modal>
            </div>
          </div>
        ) : (
          <div className="loading-dots mr-8">
            <ThreeDots fill="black" height="1.7rem" width="2.7rem" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
