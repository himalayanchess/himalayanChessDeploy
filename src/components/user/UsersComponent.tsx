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
import { CircleUser } from "lucide-react";
import Stack from "@mui/material/Stack";
import { Box, Button, FormControlLabel, Modal, Radio } from "@mui/material";
import AddUser from "@/components/user/AddUser";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import UserList from "@/components/user/UserList";
import { useDispatch, useSelector } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";

import {
  filterUsersList,
  getAllBranches,
  getAllUsers,
} from "@/redux/allListSlice";
import SearchInput from "../SearchInput";
import Link from "next/link";
import { exportUsersListToExcel } from "@/helpers/exportToExcel/exportUsersListToExcel";

const UsersComponent = ({ role = "" }: any) => {
  console.log("role inside users comp", role);

  // dispatch
  const dispatch = useDispatch<any>();

  // selector
  const {
    allActiveUsersList,
    allFilteredActiveUsersList,
    allUsersLoading,
    allActiveBranchesList,
  } = useSelector((state: any) => state.allListReducer);

  // session
  const session = useSession();

  const options = ["All", "Trainer", "Admin", "Superadmin"];
  const [searchText, setsearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedBranch, setselectedBranch] = useState("");
  // not the delete activeStatus
  // isActive property for login access
  const [selectedActiveStatus, setselectedActiveStatus] = useState("All");
  const [filteredUsersCount, setFilteredUsersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [usersPerPage] = useState(7);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  //export to excel
  const exportToExcel = () => {
    exportUsersListToExcel(allFilteredActiveUsersList);
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * usersPerPage + 1;
  const endItem = Math.min(currentPage * usersPerPage, filteredUsersCount);
  const showingText = `Showing ${startItem}-${endItem} of ${filteredUsersCount}`;

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
            (user: any) => user.role.toLowerCase() == selectedRole.toLowerCase()
          );

    // filter by branch
    tempFilteredUsersList =
      selectedBranch?.toLowerCase() == "all"
        ? tempFilteredUsersList
        : tempFilteredUsersList.filter(
            (user: any) =>
              user.branchName.toLowerCase() == selectedBranch?.toLowerCase()
          );

    // filter by active status (isActive)
    tempFilteredUsersList =
      selectedActiveStatus?.toLowerCase() === "all"
        ? tempFilteredUsersList
        : selectedActiveStatus?.toLowerCase() === "active"
        ? tempFilteredUsersList.filter((user: any) => user.isActive)
        : tempFilteredUsersList.filter((user: any) => !user.isActive);

    if (searchText.trim() !== "") {
      tempFilteredUsersList = tempFilteredUsersList.filter((user: any) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    tempFilteredUsersList = tempFilteredUsersList
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setFilteredUsersCount(tempFilteredUsersList?.length);
    setCurrentPage(1);
    dispatch(filterUsersList(tempFilteredUsersList));
  }, [
    allActiveUsersList,
    selectedRole,
    selectedBranch,
    selectedActiveStatus,
    searchText,
  ]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);
    let branchName = "All";
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
    }
    setselectedBranch(branchName);
  }, [session?.data?.user]);

  // intial data fetch
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllBranches());
  }, []);
  return (
    <div className="flex w-full">
      <div className=" flex-1 flex flex-col mr-4 py-5 px-10 rounded-md shadow-md bg-white ">
        <div className="main-header flex justify-between">
          <h2 className="text-3xl mb-2 font-medium text-gray-700 flex items-center">
            <CircleUser />
            <span className="ml-2">Users List</span>
          </h2>
          {/* excel button */}
          <div className="excelbutton">
            <Button
              onClick={exportToExcel}
              variant="contained"
              color="success"
              disabled={allFilteredActiveUsersList?.length === 0}
              startIcon={<DownloadIcon />}
            >
              Export to Excel
            </Button>
          </div>
        </div>
        <div className="title-search-container mb-0 flex justify-between items-end">
          {/* title and Dropdown */}
          <div className="title-options  w-full flex-1">
            <div className="dropdown  w-full grid grid-cols-4 gap-3 mb-1 items-end">
              <Dropdown
                label="Role"
                options={options}
                selected={selectedRole}
                onChange={setSelectedRole}
                width="full"
              />
              <Dropdown
                label="Branch"
                options={[
                  "All",
                  ...allActiveBranchesList.map(
                    (branch: any) => branch.branchName
                  ),
                ]}
                disabled={
                  !(
                    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
                    (session?.data?.user?.role?.toLowerCase() === "admin" &&
                      session?.data?.user?.isGlobalAdmin)
                  )
                }
                selected={selectedBranch}
                onChange={setselectedBranch}
                width="full"
              />
              <Dropdown
                label="Active Status"
                options={["All", "Active", "Inactive"]}
                selected={selectedActiveStatus}
                onChange={setselectedActiveStatus}
                width="full"
              />
              <span className="text-sm text-gray-600">{showingText}</span>
            </div>
          </div>

          <div className="search-options flex items-center">
            {/* Search */}
            <div className="search-filter-menus flex gap-4">
              {/* search input */}
              <SearchInput
                placeholder="Search"
                value={searchText}
                onChange={(e: any) => setsearchText(e.target.value)}
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

        <Stack spacing={2} className="mx-auto w-max mt-3">
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
