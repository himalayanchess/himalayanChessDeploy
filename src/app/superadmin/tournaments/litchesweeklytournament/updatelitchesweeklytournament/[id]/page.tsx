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
import UpdateLitchesWeeklyTournament from "@/components/tournaments/litchesweeklytournaments/UpdateLitchesWeeklyTournament";

const page = ({ params }: any) => {
  const { id: litchesTournamentId }: any = use(params);

  const [loading, setLoading] = useState(false);
  const [invalidId, setinvalidId] = useState(false);
  const [litchesTournamentRecord, setlitchesTournamentRecord] =
    useState<any>(null);

  async function getlitchesTournamentRecord() {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        "/api/tournaments/litches/getLitchesTournament",
        {
          litchesTournamentId,
        }
      );
      setlitchesTournamentRecord(resData.litchesTournamentRecord);
      if (
        resData?.statusCode == 204 ||
        resData.litchesTournamentRecord?.length == 0
      ) {
        setinvalidId(true);
      }
    } catch (error) {
      console.log(
        "error in updatestudent : [id], getlitchesTournamentRecord api",
        error
      );
    } finally {
      setLoading(false);
    }
  }
  // initial fecth of selected activity record
  useEffect(() => {
    getlitchesTournamentRecord();
  }, [litchesTournamentId]);
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
          {loading ? (
            <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading record...</span>
            </div>
          ) : invalidId ? (
            <div className="flex-1 flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
              Invalid litchesTournamentId
            </div>
          ) : (
            <UpdateLitchesWeeklyTournament
              litchesTournamentRecord={litchesTournamentRecord}
            />
            // <UpdateStudent litchesTournamentRecord={litchesTournamentRecord} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
