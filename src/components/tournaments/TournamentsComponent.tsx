import React from "react";
import { Trophy } from "lucide-react";
import AddTournament from "./AddTournament";
import ParticipantsPage from "./ParticipantsPage";
import Link from "next/link";
import { useSession } from "next-auth/react";

const TournamentsComponent = () => {
  const session = useSession();
  return (
    <div className="flex-1 flex flex-col py-3 px-10 border bg-white rounded-lg">
      <h2 className="text-3xl font-medium text-gray-700 flex items-center ">
        <Trophy />
        <span className="ml-2">Tournaments</span>
      </h2>
      {/* <AddTournament />
      <ParticipantsPage /> */}
      <Link
        className="underline"
        href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/lichessweeklytournament`}
      >
        lichessweeklytournament
      </Link>
      <Link
        className="underline"
        href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/othertournaments`}
      >
        other tournaments
      </Link>
      TournamentsComponent
    </div>
  );
};

export default TournamentsComponent;
