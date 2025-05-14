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
import UpdateTournamentyHcaHelpIn from "@/components/tournaments/tournamentshcahelpin/UpdateTournamentyHcaHelpIn";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";

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
      if (
        resData?.statusCode == 204 ||
        resData.tournamentHcaHelpInRecord?.length == 0
      ) {
        setinvalidId(true);
      }
    } catch (error) {
      console.log(
        "error in update tournament hca help in : [id], gettournamentHcaHelpInRecord api",
        error
      );
    } finally {
      setLoading(false);
    }
  }
  // initial fecth of tournaments hca help in record
  useEffect(() => {
    gettournamentHcaHelpInRecord();
  }, [tournamentHcaHelpInId]);
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
              Invalid tournament id
            </div>
          ) : (
            <UpdateTournamentyHcaHelpIn
              tournamentHcaHelpInRecord={tournamentHcaHelpInRecord}
            />
            // <UpdateStudent tournamentHcaHelpInRecord={tournamentHcaHelpInRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
