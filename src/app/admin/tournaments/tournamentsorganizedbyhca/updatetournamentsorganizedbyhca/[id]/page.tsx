"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";

import TrainerHistory from "@/components/trainer/trainerhistory/TrainerHistory";
import ViewActivityRecordDetail from "@/components/activityrecord/ViewActivityRecordDetail";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import UpdateStudent from "@/components/student/UpdateStudent";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import UpdateOtherTournament from "@/components/tournaments/othertournaments/UpdateOtherTournament";
import UpdateTournamentOrganizedByHca from "@/components/tournaments/tournamentsorganizedbyhca/UpdateTournamentOrganizedByHca";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";

const page = ({ params }: any) => {
  const { id: tournamentOrganizedByHcaId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [tournamentOrganizedByHcaRecord, settournamentOrganizedByHcaRecord] =
    useState<any>(null);

  async function gettournamentOrganizedByHcaRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/tournaments/tournamentsorganizedbyhca/getTournamentOrganizedByHca",
        {
          tournamentOrganizedByHcaId,
        }
      );
      settournamentOrganizedByHcaRecord(resData.tournamentOrganizedByHcaRecord);
      if (
        resData?.statusCode == 204 ||
        resData.tournamentOrganizedByHcaRecord?.length == 0
      ) {
        setinvalidId(true);
      }
    } catch (error) {
      console.log(
        "error in updatestudent : [id], gettournamentOrganizedByHcaRecord api",
        error
      );
    } finally {
      setLoading(false);
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    gettournamentOrganizedByHcaRecord();
  }, [tournamentOrganizedByHcaId]);
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
        <div className="pb-6 flex flex-col h-[91dvh]  py-5 px-14 ">
          {loading ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId && !loading ? (
            <div className="flex-1 flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
              Invalid tournamentOrganizedByHcaId
            </div>
          ) : (
            <UpdateTournamentOrganizedByHca
              tournamentOrganizedByHcaRecord={tournamentOrganizedByHcaRecord}
            />
            // <UpdateStudent tournamentOrganizedByHcaRecord={tournamentOrganizedByHcaRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
