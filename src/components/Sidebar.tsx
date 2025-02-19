"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Settings, User, ChevronDown } from "lucide-react";
import AddUser from "./user/AddUser";

const Sidebar = ({ menuItems, setActiveComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeMenu, setActiveMenu] = useState(menuItems[0].label);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <motion.div
      className="h-screen bg-gray-200 text-black fixed top-0 left-0 flex flex-col items-center py-16 shadow-lg"
      initial={{ width: "3rem" }}
      animate={{ width: isExpanded ? "16rem" : "3rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="flex flex-col gap-2 w-full">
        {menuItems.map((item, index) => (
          <div key={index} className="relative">
            <button
              className={`flex items-center justify-start  gap-3 px-3 py-2 w-full ${
                activeMenu === item.label
                  ? "bg-gray-600 text-white"
                  : "hover:bg-gray-300"
              }  transition-all`}
              onClick={() => {
                setActiveMenu(item.label);
                // set active component
                setActiveComponent(item.label);
                item.hasDropdown && toggleDropdown(index);
              }}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
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
            </button>
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
                    className="px-4 py-2 text-sm hover:bg-gray-700 transition-all cursor-pointer"
                  >
                    {option}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
