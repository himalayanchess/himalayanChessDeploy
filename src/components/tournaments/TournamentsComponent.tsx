import React from "react";
import {
  Trophy,
  ShieldCheck,
  Users,
  Star,
  Globe,
  Medal,
  Laptop,
  HandHelping,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const tournamentTypes = [
  {
    title: "Lichess Weekly Tournament",
    href: "lichessweeklytournament",
    icon: <Laptop className="w-6 h-6 text-green-500" />,
    description: "Online weekly tournaments hosted on Lichess.",
  },
  {
    title: "Other Tournaments",
    href: "othertournaments",
    icon: <Star className="w-6 h-6 text-yellow-500" />,
    description: "External or miscellaneous tournaments.",
  },
  {
    title: "Tournaments Organized by HCA",
    href: "tournamentsorganizedbyhca",
    icon: <Trophy className="w-6 h-6 text-green-500" />,
    description: "Managed and hosted directly by HCA.",
  },
  {
    title: "Tournaments HCA Helped In",
    href: "tournamentshcahelpin",
    icon: <HandHelping className="w-6 h-6 text-indigo-500" />,
    description: "Tournaments where HCA contributed.",
  },
  {
    title: "HCA Circuit",
    href: "hcacircuit",
    icon: <Medal className="w-6 h-6 text-gray-500" />,
    description: "Official HCA Circuit tournaments.",
  },
];

const TournamentsComponent = () => {
  const session = useSession();
  const userRole = session?.data?.user?.role?.toLowerCase();

  return (
    <div className="flex-1 flex flex-col py-6 px-10 border bg-white rounded-lg">
      <div className="">
        <h2 className="text-3xl  text-gray-800 mb-8 flex items-center gap-2">
          <Trophy />
          Tournaments
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournamentTypes.map((type, index) => (
            <Link
              key={index}
              href={`/${userRole}/tournaments/${type.href}`}
              className="bg-white border hover:shadow-lg transition-all rounded-lg p-6 flex flex-col gap-3 group"
            >
              <div className="flex items-center gap-3">
                {type.icon}
                <h3 className="text-lg font-semibold text-gray-700 group-hover:text-gray-500">
                  {type.title}
                </h3>
              </div>
              <p className="text-sm text-gray-500">{type.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentsComponent;
