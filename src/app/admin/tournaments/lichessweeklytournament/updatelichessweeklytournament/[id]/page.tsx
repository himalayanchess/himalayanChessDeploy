"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";

import TrainerHistory from "@/components/trainer/trainerhistory/TrainerHistory";
import ViewActivityRecordDetail from "@/components/activityrecord/ViewActivityRecordDetail";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import UpdateStudent from "@/components/student/UpdateStudent";
import UpdateLichessWeeklyTournament from "@/components/tournaments/lichessweeklytournaments/UpdateLichessWeeklyTournament";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";

const page = ({ params }: any) => {
  const { id: lichessTournamentId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [lichessTournamentRecord, setlichessTournamentRecord] =
    useState<any>(null);

  async function getlichessTournamentRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/tournaments/lichess/getLichessTournament",
        {
          lichessTournamentId,
        }
      );
      setlichessTournamentRecord(resData.lichessTournamentRecord);
      if (
        resData?.statusCode == 204 ||
        resData.lichessTournamentRecord?.length == 0
      ) {
        setinvalidId(true);
      }
    } catch (error) {
      console.log(
        "error in updatestudent : [id], getlichessTournamentRecord api",
        error
      );
    } finally {
      setLoading(false);
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getlichessTournamentRecord();
  }, [lichessTournamentId]);
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
          ) : invalidId ? (
            <div className="flex-1 flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
              Invalid lichessTournamentId
            </div>
          ) : (
            <UpdateLichessWeeklyTournament
              lichessTournamentRecord={lichessTournamentRecord}
            />
            // <UpdateStudent lichessTournamentRecord={lichessTournamentRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
