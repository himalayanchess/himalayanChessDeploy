"use client";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import { Component, List, Trophy } from "lucide-react";
import Header from "@/components/Header";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
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
import DownloadIcon from "@mui/icons-material/Download";

import { getAllBranches } from "@/redux/allListSlice";

import Link from "next/link";

import SearchInput from "@/components/SearchInput";
import {
  fetchAllLichessTournaments,
  filterLichessTournamentList,
} from "@/redux/allTournamentSlice";
import LichessTournamentsList from "./LichessTournamentsList";
import { exportLichessTournamentListToExcel } from "@/helpers/exportToExcel/exportLichessTournamentListToExcel";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import LichessLeaderboardComponent from "./lichessleaderboard/LichessLeaderboardComponent";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const LichessWeeklyTournamentComponent = () => {
  // dispatch
  const dispatch = useDispatch<any>();

  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  // selector
  const { allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  const {
    allActiveLichessTournamentsList,
    allFilteredActiveLichessTournamentsList,
    allLichessTournamentsLoading,
  } = useSelector((state: any) => state.allTournamentReducer);

  // const affilatedToOptions = ["All", "HCA", "School"];
  // const completedStatusOptions = ["All", "Ongoing", "Completed"];

  // Default values
  const defaultMonth = dayjs().tz(timeZone).format("YYYY-MM");
  const defaultStartDate = dayjs()
    .tz(timeZone)
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const defaultEndDate = dayjs().tz(timeZone).format("YYYY-MM-DD");

  const [selectedMenu, setselectedMenu] = useState("tournamentlist");
  const [searchText, setsearchText] = useState("");
  const [selectedBranch, setselectedBranch] = useState("");
  const [filteredLichessTournamentCount, setfilteredLichessTournamentCount] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [lichessTournamentsPerPage] = useState(7);
  const [selectedMonth, setselectedMonth] = useState(defaultMonth);
  const [useAdvancedDate, setUseAdvancedDate] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * lichessTournamentsPerPage + 1;
  const endItem = Math.min(
    currentPage * lichessTournamentsPerPage,
    filteredLichessTournamentCount
  );
  const showingText = `Showing ${startItem}-${endItem} of ${filteredLichessTournamentCount}`;

  //export to excel
  const exportToExcel = () => {
    exportLichessTournamentListToExcel(allFilteredActiveLichessTournamentsList);
  };

  // Reset current page to 1 and search text when selectedStatus changes
  useEffect(() => {
    setCurrentPage(1);
    setsearchText("");
  }, [selectedBranch]);

  // if affiliated to changes then reset project dropdown
  useEffect(() => {
    // Check if the user is a superadmin or global admin
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    // Only reset if it's a superadmin or global admin
    if (isSuperOrGlobalAdmin) {
      setselectedBranch("All");
    }
  }, [session?.data?.user]);

  // filter
  useEffect(() => {
    // filter litchtes tournaments
    let tempFilteredLichessTournamentsList =
      allActiveLichessTournamentsList?.slice();

    // filter by branch
    tempFilteredLichessTournamentsList =
      selectedBranch?.toLowerCase() == "all"
        ? tempFilteredLichessTournamentsList
        : tempFilteredLichessTournamentsList?.filter(
            (tournament: any) =>
              tournament.branchName.toLowerCase() ==
              selectedBranch?.toLowerCase()
          );

    // Date Filtering
    if (useAdvancedDate) {
      tempFilteredLichessTournamentsList =
        tempFilteredLichessTournamentsList.filter((tournament: any) => {
          const tournamentDate = dayjs(tournament.date)
            .tz(timeZone)
            .format("YYYY-MM-DD");

          return tournamentDate >= startDate && tournamentDate <= endDate;
        });
    } else {
      tempFilteredLichessTournamentsList =
        tempFilteredLichessTournamentsList.filter((tournament: any) => {
          const tournamentMonth = dayjs(tournament.utcDate)
            .tz(timeZone)
            .format("YYYY-MM");

          return tournamentMonth === selectedMonth;
        });
    }

    // search text
    if (searchText.trim() !== "") {
      tempFilteredLichessTournamentsList =
        tempFilteredLichessTournamentsList.filter((tournament: any) =>
          tournament.tournamentName
            .toLowerCase()
            .includes(searchText.toLowerCase())
        );
    }

    // Sorting with dayjs in Nepali timezone
    tempFilteredLichessTournamentsList =
      tempFilteredLichessTournamentsList?.sort(
        (a: any, b: any) =>
          dayjs.tz(b.date, "Asia/Kathmandu").valueOf() -
          dayjs.tz(a.date, "Asia/Kathmandu").valueOf()
      );

    setfilteredLichessTournamentCount(
      tempFilteredLichessTournamentsList?.length
    );
    setCurrentPage(1);
    dispatch(filterLichessTournamentList(tempFilteredLichessTournamentsList));
  }, [
    allActiveLichessTournamentsList,
    selectedBranch,
    searchText,
    useAdvancedDate,
    startDate,
    endDate,
    selectedMonth,
  ]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);
    let branchName = "All";
    // let affiliatedTo = "All";
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
      // affiliatedTo = "HCA";
    }
    setselectedBranch(branchName);
    // setselectedAffiliatedTo(affiliatedTo);
  }, [session?.data?.user]);

  // intial data fetch
  useEffect(() => {
    dispatch(fetchAllLichessTournaments());

    dispatch(getAllBranches());
  }, []);
  return (
    <div className="flex-1 flex flex-col py-6 px-10 border bg-white rounded-lg">
      <div className="main-header flex justify-between">
        <div className="title-menus flex items-center gap-4 ">
          {/* title */}

          <h2 className="text-3xl mb-2 font-medium text-gray-700 flex items-center">
            <Trophy />
            <span className="ml-1">Lichess </span>
          </h2>

          {/* menus */}
          <Button
            onClick={() => {
              setselectedMenu("tournamentlist");
            }}
            color="primary"
            variant={
              selectedMenu === "tournamentlist" ? "contained" : "outlined"
            }
            startIcon={<List size={18} />}
          >
            Tournaments List
          </Button>

          <Button
            onClick={() => {
              setselectedMenu("leaderboard");
            }}
            color="primary"
            variant={selectedMenu === "leaderboard" ? "contained" : "outlined"}
            startIcon={<LeaderboardOutlinedIcon />}
          >
            Leaderboard
          </Button>
        </div>

        {/* excel button */}
        {selectedMenu?.toLowerCase() == "tournamentlist" && (
          <div className="excelbutton">
            <Button
              onClick={exportToExcel}
              variant="contained"
              color="success"
              disabled={allFilteredActiveLichessTournamentsList?.length === 0}
              startIcon={<DownloadIcon />}
            >
              Export to Excel
            </Button>
          </div>
        )}
      </div>
      {/* title and Dropdown */}
      <div className="batches-header my-0 flex items-end justify-between gap-2">
        <div className="dropdowns-showing flex flex-1  gap-4 items-end">
          <div className="dropdowns grid grid-cols-4 gap-2  w-full">
            {/* branch */}
            <Dropdown
              label="Branch"
              options={[
                "All",
                ...(allActiveBranchesList?.map(
                  (branch: any) => branch.branchName
                ) || []),
              ]}
              disabled={!isSuperOrGlobalAdmin}
              selected={selectedBranch}
              onChange={setselectedBranch}
              width="full"
            />

            {/* date */}

            <Input
              label="Date"
              type="month"
              value={selectedMonth}
              disabled={useAdvancedDate}
              onChange={(e: any) => setselectedMonth(e.target.value)}
              width="full"
            />

            {/* start date */}
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              disabled={!useAdvancedDate}
              onChange={(e: any) => setStartDate(e.target.value)}
            />

            {/* end date */}
            <Input
              label="End Date"
              type="date"
              value={endDate}
              disabled={!useAdvancedDate}
              onChange={(e: any) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Search */}
        <div className="search-filter-menus flex gap-4">
          {/* search input */}
          <SearchInput
            placeholder="Search"
            value={searchText}
            onChange={(e: any) => setsearchText(e.target.value)}
          />

          {/* add batch button */}
          {session?.data?.user?.session?.data?.user?.role?.toLowerCase() !=
          "trainer" ? (
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/lichessweeklytournament/addlichessweeklytournament`}
            >
              <Button variant="contained" size="small">
                <AddIcon />
                <span className="ml-1">Add Tournament</span>
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
              <span className="ml-1">Add Tournament</span>
            </Button>
          )}
        </div>
      </div>

      <div className="checkbox-showingtext mt-1 flex items-end gap-4">
        {/* Checkbox for Advanced Date Selection */}
        <div className="mt-1 flex items-center gap-2">
          <input
            id="advancedcheckbox"
            type="checkbox"
            checked={useAdvancedDate}
            onChange={() => setUseAdvancedDate(!useAdvancedDate)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
          />
          <label
            htmlFor="advancedcheckbox"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Use Advanced Date Selection
          </label>
        </div>
        {/* count */}
        {selectedMenu?.toLowerCase() == "tournamentlist" && (
          <span className="text-sm text-gray-600">{showingText}</span>
        )}
      </div>

      {/* tournament list */}
      {selectedMenu?.toLowerCase() == "tournamentlist" && (
        <>
          <LichessTournamentsList
            allFilteredActiveLichessTournamentsList={
              allFilteredActiveLichessTournamentsList
            }
            currentPage={currentPage}
            lichessTournamentsPerPage={lichessTournamentsPerPage}
            allLichessTournamentsLoading={allLichessTournamentsLoading}
          />

          <Stack spacing={2} className="mx-auto w-max mt-3">
            <Pagination
              count={Math.ceil(
                filteredLichessTournamentCount / lichessTournamentsPerPage
              )} // Total pages
              page={currentPage} //allCoursesLoading Current page
              onChange={handlePageChange} // Handle page change
              shape="rounded"
            />
          </Stack>
        </>
      )}

      {selectedMenu?.toLowerCase() == "leaderboard" && (
        <>
          <LichessLeaderboardComponent
            allFilteredActiveLichessTournamentsList={
              allFilteredActiveLichessTournamentsList
            }
            allLichessTournamentsLoading={allLichessTournamentsLoading}
            selectedMonth={selectedMonth}
            useAdvancedDate={useAdvancedDate}
            startDate={startDate}
            endDate={endDate}
          />
        </>
      )}
    </div>
  );
};

export default LichessWeeklyTournamentComponent;
