"use client";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";
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
import { useDispatch, useSelector } from "react-redux";
import { filterUsersList, getAllUsers } from "@/redux/allListSlice";
import SearchInput from "../SearchInput";
import Link from "next/link";

const UsersComponent = ({ role = "" }: any) => {
  console.log("role inside users comp", role);

  // dispatch
  const dispatch = useDispatch<any>();

  // selector
  const { allActiveUsersList, allFilteredActiveUsersList, allUsersLoading } =
    useSelector((state: any) => state.allListReducer);

  // session
  const session = useSession();

  const options = ["All", "Trainer", "Admin", "Superadmin"];
  const [searchText, setsearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [filteredUsersCount, setFilteredUsersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [usersPerPage] = useState(7);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // Reset current page to 1 and search text when selectedStatus changes
  useEffect(() => {
    setCurrentPage(1);
    setsearchText("");
  }, [selectedRole]);

  // filter
  useEffect(() => {
    // filter users
    let tempFilteredUsersList =
      selectedRole.toLowerCase() == "all"
        ? allActiveUsersList
        : allActiveUsersList.filter(
            (user) => user.role.toLowerCase() == selectedRole.toLowerCase()
          );

    if (searchText.trim() !== "") {
      tempFilteredUsersList = tempFilteredUsersList.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    tempFilteredUsersList = tempFilteredUsersList
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredUsersCount(tempFilteredUsersList?.length);
    setCurrentPage(1);
    dispatch(filterUsersList(tempFilteredUsersList));
  }, [allActiveUsersList, selectedRole, searchText]);

  // intial data fetch
  useEffect(() => {
    dispatch(getAllUsers());
  }, []);
  return (
    <div className="flex w-full">
      <div className=" flex-1 flex flex-col mr-4 py-5 px-10 rounded-md shadow-md bg-white ">
        <div className="title-search-container mb-4 flex justify-between items-end">
          {/* title and Dropdown */}
          <div className="title-options">
            <h2 className="text-3xl mb-2 font-medium text-gray-700">
              Users List
            </h2>
            <div className="dropdown flex gap-4 items-end">
              <Dropdown
                label="Role"
                options={options}
                selected={selectedRole}
                onChange={setSelectedRole}
              />
              <span className="text-xl text-white bg-gray-400 rounded-md py-1 px-3 font-bold">
                {filteredUsersCount}
              </span>
            </div>
          </div>

          <div className="search-options flex items-center">
            {/* Search */}
            <div className="search-filter-menus flex gap-4">
              {/* search input */}
              <SearchInput
                placeholder="Search"
                value={searchText}
                onChange={(e) => setsearchText(e.target.value)}
              />

              {/* add user button */}
              {role?.toLowerCase() == "superadmin" ? (
                <Link href={"/superadmin/users/adduser"}>
                  <Button variant="contained" size="small">
                    <AddIcon />
                    <span className="ml-1">Add User</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  className="w-max h-max"
                  disabled
                >
                  <LockIcon sx={{ fontSize: "1.2rem" }} />
                  <span className="ml-1">Add User</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* Table */}

        <UserList
          allFilteredActiveUsersList={allFilteredActiveUsersList}
          currentPage={currentPage}
          usersPerPage={usersPerPage}
          allUsersLoading={allUsersLoading}
          role={role}
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
  );
};

export default UsersComponent;
