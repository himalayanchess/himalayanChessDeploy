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
  fetchAllOtherTournaments,
  filterOtherTournamentList,
} from "@/redux/allTournamentSlice";
import { exportOtherTournamentListToExcel } from "@/helpers/exportToExcel/exportOtherTournamentListToExcel";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import OtherTournamentsList from "../../othertournaments/OtherTournamentsList";
import HcaCircuitSeriesTournamentList from "../hcacircuitseries/HcaCircuitSeriesTournamentList";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const HcaCircuitTournamentSeries = ({
  hcaCircuitTournamentRecord,
  allActiveMainHcaCircuitSeriesTournamentsList,
  loading,
}: any) => {
  // dispatch
  const dispatch = useDispatch<any>();

  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg">
      <div className="main-header flex justify-between">
        <div className="title-menus flex items-center gap-4 ">
          {/* title */}

          <h2 className="text-xl mb-2 font-medium text-gray-500 flex items-center">
            <Trophy size={19} />
            <span className="ml-1">Series tournaments </span>
          </h2>
        </div>

        <div className="excelbutton-addbutton flex gap-5">
          {/* add tournament button */}
          {session?.data?.user?.session?.data?.user?.role?.toLowerCase() !=
          "trainer" ? (
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/hcacircuit/addhcacircuitseriestournament/${
                hcaCircuitTournamentRecord?._id
              }`}
            >
              <Button variant="contained" size="small">
                <AddIcon />
                <span className="ml-1">Add Series Tournament</span>
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
      <span className="text-sm text-gray-500">
        Showing {allActiveMainHcaCircuitSeriesTournamentsList?.length || 0}{" "}
        records
      </span>

      <HcaCircuitSeriesTournamentList
        tournamentList={allActiveMainHcaCircuitSeriesTournamentsList}
        loading={loading}
      />
    </div>
  );
};

export default HcaCircuitTournamentSeries;
