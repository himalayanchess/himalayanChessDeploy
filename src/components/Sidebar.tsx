"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Settings, User, ChevronDown, LogOut } from "lucide-react";
import AddUser from "./user/AddUserPageBased";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";
import { Box, Button, Modal } from "@mui/material";
import { useRouter } from "next/navigation";

const Sidebar = ({ menuItems, role, activeMenu }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [signoutModalOpen, setsignoutModalOpen] = useState(false);
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <motion.div
      className="h-screen overflow-y-auto overflow-x-hidden z-50 bg-gray-200 text-black fixed top-0 left-0 flex flex-col items-center py-16 shadow-lg"
      initial={{ width: "3.4dvw" }}
      animate={{ width: isExpanded ? "15dvw" : "3.4dvw" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="flex flex-col  w-full">
        {menuItems.map((item, index) => (
          <div key={index} className="relative">
            <Link
              href={`/${role.toLowerCase()}/${item.linkName}`}
              className={`flex items-center justify-start  gap-3 px-3 py-3 w-full ${
                activeMenu === item.label
                  ? "bg-gray-600 text-white"
                  : "hover:bg-gray-300"
              }  transition-all`}
            >
              <span className="text-xl flex-shrink-0">{<item.icon />}</span>
              <motion.span
                className="text-md whitespace-nowrap"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  x: isExpanded ? 0 : -20,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {item.label}
              </motion.span>
              {item.hasDropdown && isExpanded && (
                <ChevronDown className="ml-auto" size={16} />
              )}
            </Link>
            {item.hasDropdown && openDropdown === index && isExpanded && (
              <motion.div
                className="bg-gray-800 rounded-md shadow-md mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {item.options.map((option, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 text-sm hover:bg-gray-700 transition-all cursor-pointer "
                  >
                    {option}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
        {/* logout */}
        <button
          onClick={() => setsignoutModalOpen(true)}
          className="flex items-center justify-start  gap-3 px-3 py-2 w-full transition-all hover:bg-gray-300 "
        >
          <LogoutIcon />
          <motion.span
            className="text-md whitespace-nowrap"
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
              <p className="poppins font-bold text-2xl ">Logout Confirmation</p>
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
                    setIsExpanded(false);
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
      </nav>
    </motion.div>
  );
};

export default Sidebar;
