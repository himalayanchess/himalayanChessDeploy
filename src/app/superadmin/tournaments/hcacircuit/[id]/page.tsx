"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import ViewLichessTournament from "@/components/tournaments/lichessweeklytournaments/ViewLichessTournament";
import ViewHcaCircuitTournament from "@/components/tournaments/hcacircuit/ViewHcaCircuitTournament";

const page = ({ params }: any) => {
  const { id: hcaCircuitTournamentId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [hcaCircuitTournamentRecord, sethcaCircuitTournamentRecord] =
    useState<any>(null);

  async function gethcaCircuitTournamentRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/tournaments/hcacircuit/gethcacircuittournament",
        {
          hcaCircuitTournamentId,
        }
      );
      sethcaCircuitTournamentRecord(resData.hcaCircuitTournamentRecord);

      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(
        "error in gethcacircuit tournament : [id], gethcaCircuitTournamentRecord api",
        error
      );
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    gethcaCircuitTournamentRecord();
  }, [hcaCircuitTournamentId]);
  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="superadmin"
        activeMenu="Tournaments"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          {loading || !hcaCircuitTournamentId ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId ? (
            <p>Invalid hca circuit tournament id</p>
          ) : (
            <ViewHcaCircuitTournament
              hcaCircuitTournamentRecord={hcaCircuitTournamentRecord}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
