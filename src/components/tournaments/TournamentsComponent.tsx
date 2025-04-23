import React from "react";
import { Trophy } from "lucide-react";
import AddTournament from "./AddTournament";
import ParticipantsPage from "./ParticipantsPage";

const TournamentsComponent = () => {
  return (
    <div className="flex-1 flex flex-col py-3 px-10 border bg-white rounded-lg">
      <h2 className="text-3xl font-medium text-gray-700 flex items-center ">
        <Trophy />
        <span className="ml-2">Tournaments</span>
      </h2>
      <AddTournament />
      <ParticipantsPage />
      TournamentsComponent
    </div>
  );
};

export default TournamentsComponent;
