"use client";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import SearchIcon from "@mui/icons-material/Search";
import Header from "@/components/Header";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Box, Button, Modal } from "@mui/material";
import AddUser from "@/components/user/AddUser";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { Controller, useForm } from "react-hook-form";

const MembersTable = () => {
  const [searchText, setsearchText] = useState("");
  const options = ["Student", "Trainer", "Admin", "Superadmin"];
  const [selectedRole, setSelectedRole] = useState(options[0]);
  const [allUsers, setallUsers] = useState<any>([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredUsersCount, setFilteredUsersCount] = useState(0);
  const [open, setOpen] = React.useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [usersPerPage] = useState(2);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    // First, filter by role
    let filteredByRole = allUsers.filter(
      (user) => user.role.toLowerCase() === selectedRole.toLowerCase() // Match role with selectedRole
    );

    // Apply search filter only if searchText is not empty
    if (searchText.trim() !== "") {
      filteredByRole = filteredByRole.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Update the filteredUsers state
    setFilteredUsers(filteredByRole);

    // Update the total count of filtered users
    setFilteredUsersCount(filteredByRole.length);

    // Reset the current page to 1 if filtered list is empty or searchText is changed
    setCurrentPage(1);
  }, [allUsers, selectedRole, searchText]);

  // Get list of all users
  async function getAllUsers() {
    try {
      const { data: resData } = await axios.get("/api/users/getAllUsers");
      setallUsers(resData.allUsers);
    } catch (error) {
      console.log("error in superadmin/users (getallusers)", error);
    }
  }

  useEffect(() => {
    // Reset current page to 1 when selectedRole changes
    setCurrentPage(1);
  }, [selectedRole]);

  return (
    <div>
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Users"
      />
      <div className="ml-[3rem] w-[96%]">
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
                  <AddUser />
                </Box>
              </Modal>
            </div>
          </div>
          <p>{searchText}</p>
          {/* Table */}
          <div className="overflow-x-auto flex-1 bg-white shadow-md rounded-lg">
            <div className="grid grid-cols-5 w-full bg-gray-200">
              <span className="p-3 text-left text-sm font-medium text-gray-600">
                Name
              </span>
              <span className="p-3 text-left text-sm font-medium text-gray-600">
                Email
              </span>
              <span className="p-3 text-left text-sm font-medium text-gray-600">
                Gender
              </span>
              <span className="p-3 text-left text-sm font-medium text-gray-600">
                Role
              </span>
              <span className="p-3 text-left text-sm font-medium text-gray-600">
                Actions
              </span>
            </div>

            {filteredUsers
              .slice(
                (currentPage - 1) * usersPerPage,
                currentPage * usersPerPage
              )
              .map((member: any) => (
                <div
                  key={member?._id}
                  className="border-t grid grid-cols-5 hover:bg-gray-50"
                >
                  <span className="p-3 text-sm text-gray-700">
                    {member?.name}
                  </span>
                  <span className="p-3 text-sm text-gray-700">
                    {member?.email}
                  </span>
                  <span className="p-3 text-sm text-gray-700">
                    {member?.gender}
                  </span>
                  <span className="p-3 text-sm text-gray-500">
                    {member?.role}
                  </span>
                  <div className="p-3 text-sm text-gray-500">
                    <button className="edit">
                      <ModeEditIcon />
                    </button>
                    <button className="edit">
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
          </div>
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

export default MembersTable;
