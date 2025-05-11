"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import ViewOtherTournament from "@/components/tournaments/othertournaments/ViewOtherTournament";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import ViewTournamentOrganizedByHca from "@/components/tournaments/tournamentsorganizedbyhca/ViewTournamentOrganizedByHca";
import ViewTournamentHcaHelpIn from "@/components/tournaments/tournamentshcahelpin/ViewTournamentHcaHelpIn";

const page = ({ params }: any) => {
  const { id: tournamentHcaHelpInId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [tournamentHcaHelpInRecord, settournamentHcaHelpInRecord] =
    useState<any>(null);

  async function gettournamentHcaHelpInRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/tournaments/tournamentshcahelpin/gettournamenthcahelpin",
        {
          tournamentHcaHelpInId,
        }
      );
      settournamentHcaHelpInRecord(resData.tournamentHcaHelpInRecord);

      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(
        "error in updateo tournament org by hca : [id], getupdatetournamentorg by hca api",
        error
      );
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    gettournamentHcaHelpInRecord();
  }, [tournamentHcaHelpInId]);
  return (
    <div>
      <Sidebar
        menuItems={superadminMenuItems}
        // role={session?.data?.user.role}
        role="Superadmin"
        activeMenu="Tournaments"
      />
      <div className="ml-[3.4dvw] w-[96.6dvw] ">
        <Header />
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          {loading || !tournamentHcaHelpInId ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId ? (
            <p>Invalid tournament id</p>
          ) : (
            <ViewTournamentHcaHelpIn
              tournamentHcaHelpInRecord={tournamentHcaHelpInRecord}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
