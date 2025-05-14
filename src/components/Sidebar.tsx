"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Settings, User, ChevronDown, LogOut } from "lucide-react";
import AddUser from "./user/AddUserPageBased";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import { Box, Button, Modal } from "@mui/material";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";

const Sidebar = ({ menuItems, role, activeMenu }: any) => {
  const router = useRouter();
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [signoutModalOpen, setsignoutModalOpen] = useState(false);
  const [logoutLoading, setlogoutLoading] = useState(false);

  return (
    <motion.div
      className="h-screen overflow-y-auto z-40 overflow-x-hidden bg-gray-700 text-white fixed top-0 left-0 flex flex-col pt-[3vh] items-center  shadow-md"
      initial={{ width: "3.4dvw" }}
      animate={{ width: isExpanded ? "15dvw" : "3.4dvw" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="flex flex-col justify-between h-full w-full">
        <div className="top-menus">
          {menuItems.map((item: any, index: any) => {
            if (
              (item.linkName === "projects" || item.linkName === "branches") &&
              !isSuperOrGlobalAdmin
            )
              return null;

            return (
              <motion.div
                key={index}
                className="relative"
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <Link
                  href={`/${role.toLowerCase()}/${item.linkName}`}
                  className={`flex items-center justify-start gap-3 px-3 py-2.5 w-full ${
                    activeMenu === item.label
                      ? "bg-gray-200 text-black rounded-l-xl"
                      : "hover:bg-gray-600"
                  } transition-all`}
                >
                  {/* Icon with scale on hover */}
                  <motion.span
                    className="text-xl flex-shrink-0"
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 0.9 },
                    }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                  >
                    {<item.icon />}
                  </motion.span>

                  {/* Text with translate on hover */}
                  <motion.span
                    className="text-md whitespace-nowrap"
                    variants={{
                      rest: { x: 0, opacity: isExpanded ? 1 : 0 },
                      hover: { x: 6, opacity: isExpanded ? 1 : 0 },
                    }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* logout */}
        {/* <div className="bottom-menus">
          <Link
            href={`/${role.toLowerCase()}/changepassword`}
            className={`flex items-center justify-start  gap-3 px-3 py-3 w-full  ${
              activeMenu?.toLowerCase() === "change password"
                ? "bg-gray-200 text-black rounded-l-xl"
                : "hover:bg-gray-600"
            }  transition-all`}
          >
            <span className="text-xl flex-shrink-0">
              {<SettingsSuggestIcon />}
            </span>
            <motion.span
              className="text-md whitespace-nowrap"
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                x: isExpanded ? 0 : -20,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Change Password
            </motion.span>
          </Link>
          <button
            onClick={() => setsignoutModalOpen(true)}
            className="flex items-center justify-start  gap-3 px-3 py-2 w-full transition-all hover:bg-gray-600 "
          >
            <LogoutIcon />
            <motion.span
              className="text-md whitespace-nowrap "
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                x: isExpanded ? 0 : -20,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Logout
            </motion.span>
          </button>
          <Modal
            open={signoutModalOpen}
            onClose={() => {
              setsignoutModalOpen(false);
              setIsExpanded(false);
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
                  {logoutLoading ? (
                    <LoadingButton
                      variant="contained"
                      size="medium"
                      color="error"
                      loading={logoutLoading}
                      loadingPosition="start"
                      sx={{ marginRight: ".5rem", paddingInline: "1.5rem" }}
                      className="mt-7 w-max"
                    >
                
                      Logging out
                    </LoadingButton>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      size="medium"
                      color="error"
                      onClick={async () => {

                        setlogoutLoading(true);
                        await signOut({ redirect: false });
                        router.push("/login");
                        setlogoutLoading(false);
                      }}
                      sx={{ marginRight: ".5rem", paddingInline: "1.5rem" }}
                    >
                      Logout
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => {
                      setsignoutModalOpen(false);
                      setIsExpanded(false);
                    }}
                    sx={{ marginLeft: ".5rem", paddingInline: "1.5rem" }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            </Box>
          </Modal>
        </div> */}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
