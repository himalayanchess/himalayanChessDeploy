"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { adminMenuItems } from "@/sidebarMenuItems/adminMenuItems";
import ViewOtherTournament from "@/components/tournaments/othertournaments/ViewOtherTournament";

const page = ({ params }: any) => {
  const { id: otherTournamentId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [otherTournamentRecord, setotherTournamentRecord] = useState<any>(null);

  async function getotherTournamentRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/tournaments/othertournaments/getOtherTournament",
        {
          otherTournamentId,
        }
      );
      setotherTournamentRecord(resData.otherTournamentRecord);

      if (resData?.statusCode == 204) {
        setinvalidId(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(
        "error in updateother tournament : [id], getotherTournamentRecord api",
        error
      );
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getotherTournamentRecord();
  }, [otherTournamentId]);
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
          {loading || !otherTournamentId ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId ? (
            <p>Invalid tournament id</p>
          ) : (
            <ViewOtherTournament
              otherTournamentRecord={otherTournamentRecord}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
