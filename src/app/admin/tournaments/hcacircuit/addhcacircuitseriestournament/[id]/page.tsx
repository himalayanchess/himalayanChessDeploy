"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AddLichessWeeklyTournaments from "@/components/tournaments/lichessweeklytournaments/AddLichessWeeklyTournament";
import AddOtherTournament from "@/components/tournaments/othertournaments/AddOtherTournament";
import CircularProgress from "@mui/material/CircularProgress";

import AddUser from "@/components/user/AddUser";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import AddHcaCircuitSeriesTournament from "@/components/tournaments/hcacircuit/hcacircuitseries/AddHcaCircuitSeriesTournament";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";

const page = ({ params }: any) => {
  // get the main hca circuit tournament record
  const { id: hcaCircuitTournamentId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [mainHcaCircuitTournamentRecord, setmainHcaCircuitTournamentRecord] =
    useState<any>(null);

  async function getMainHcaCircuitTournamentRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/tournaments/hcacircuit/gethcacircuittournament",
        {
          hcaCircuitTournamentId,
        }
      );
      setmainHcaCircuitTournamentRecord(resData.hcaCircuitTournamentRecord);
      if (
        resData?.statusCode == 204 ||
        resData.hcaCircuitTournamentRecord?.length == 0
      ) {
        setinvalidId(true);
      }
    } catch (error) {
      console.log(
        "error in getMainHcaCircuitTournamentRecord : [id], getMainHcaCircuitTournamentRecord api",
        error
      );
    } finally {
      setLoading(false);
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getMainHcaCircuitTournamentRecord();
  }, [hcaCircuitTournamentId]);

  return (
    <div>
      <Sidebar
        menuItems={adminMenuItems}
        // role={session?.data?.user.role}
        role="Admin"
        activeMenu="Tournaments"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 h-[91dvh]  flex py-5 px-14 ">
          {loading ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId ? (
            <div className="flex-1 flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
              Invalid hca circuit tournament id
            </div>
          ) : mainHcaCircuitTournamentRecord ? (
            <AddHcaCircuitSeriesTournament
              mainHcaCircuitTournamentRecord={mainHcaCircuitTournamentRecord}
            />
          ) : (
            // Optional: null or fallback UI
            <div className="flex-1 flex items-center justify-center">
              No data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
