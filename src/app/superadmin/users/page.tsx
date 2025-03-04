"use client";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Header from "@/components/Header";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Box, Button, FormControlLabel, Modal, Radio } from "@mui/material";
import AddUser from "@/components/user/AddUser";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import UserList from "@/components/user/UserList";

const Users = () => {
  const session = useSession();

  const [sessionRole, setsessionRole] = useState(null);
  const [searchText, setsearchText] = useState("");
  const options = ["Student", "Trainer", "Admin", "Superadmin"];
  const [selectedRole, setSelectedRole] = useState(options[0]);
  const [filteredUsersCount, setFilteredUsersCount] = useState(0);
  const [open, setOpen] = React.useState(false);
  // new user added
  const [newUserAdded, setnewUserAdded] = useState(false);
  const [newCreatedUser, setnewCreatedUser] = useState();

  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [usersPerPage] = useState(7);
  // **New State for Active Status Filter**
  const [activeStatus, setActiveStatus] = useState("active"); // Default: Active
  // loggedin users role
  useEffect(() => {
    if (session) {
      setsessionRole(session?.data?.user?.role);
    }
  }, [session]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Reset current page to 1 and active statyus to active when selectedRole changes
  useEffect(() => {
    setCurrentPage(1);
    setsearchText("");
    setActiveStatus("active");
  }, [selectedRole]);
  // resest search when active status changes
  useEffect(() => {
    setCurrentPage(1);
    setsearchText("");
  }, [activeStatus]);
  return (
    <div className="">
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Users"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[92dvh] flex flex-col pt-3 px-14">
          <div className="title-search-container mb-4 flex justify-between items-end">
            {/* title and Dropdown */}
            <div className="title-options">
              <h2 className="text-3xl mb-2 font-medium text-gray-700">
                Users List
              </h2>
              <Dropdown
                label=""
                options={options}
                selected={selectedRole}
                onChange={setSelectedRole}
              />
            </div>
            {/* Filters Section */}
            <div className=" flex items-center justify-start ">
              <span className="bg-gray-400  text-white py-1 px-3 rounded-full  mr-4 text-sm font-bold">
                Filter by
              </span>
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    checked={activeStatus === "active"}
                    onChange={() => setActiveStatus("active")}
                    color="default"
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    checked={activeStatus === "inactive"}
                    onChange={() => setActiveStatus("inactive")}
                    color="default"
                  />
                }
                label="Inactive"
              />
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    checked={activeStatus === "all"}
                    onChange={() => setActiveStatus("all")}
                    color="default"
                  />
                }
                label="All"
              />
            </div>
            <div className="search-options flex items-center">
              {/* Search */}
              <div className="search-div flex border-b-[1px] mr-7 border-gray-300 p-2  ">
                <SearchIcon className="mr-2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search"
                  value={searchText}
                  className="w-full outline-none"
                  onChange={(e) => setsearchText(e.target.value)}
                />
              </div>
              <button title="Add user" onClick={handleOpen}>
                <AddIcon
                  className="bg-gray-400 text-white p-1 rounded-full"
                  style={{ fontSize: "2rem" }}
                />
              </button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
              >
                <Box className="w-[80%] h-[90%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                  {/* add mode */}
                  <AddUser
                    newUserAdded={newUserAdded}
                    setnewUserAdded={setnewUserAdded}
                    newCreatedUser={newCreatedUser}
                    setnewCreatedUser={setnewCreatedUser}
                    handleClose={handleClose}
                    mode="add"
                  />
                </Box>
              </Modal>
            </div>
          </div>
          {/* Table */}
          <UserList
            role={sessionRole}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            usersPerPage={usersPerPage}
            searchText={searchText}
            selectedRole={selectedRole}
            setFilteredUsersCount={setFilteredUsersCount}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            newUserAdded={newUserAdded}
            setnewUserAdded={setnewUserAdded}
            newCreatedUser={newCreatedUser}
            setnewCreatedUser={setnewCreatedUser}
          />

          <Stack spacing={2} className="mx-auto w-max mt-7">
            <Pagination
              count={Math.ceil(filteredUsersCount / usersPerPage)} // Total pages
              page={currentPage} // Current page
              onChange={handlePageChange} // Handle page change
              shape="rounded"
            />
          </Stack>
        </div>
      </div>
      {/* pagination */}
    </div>
  );
};

export default Users;
