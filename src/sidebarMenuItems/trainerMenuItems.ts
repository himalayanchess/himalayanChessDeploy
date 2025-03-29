import {
  LayoutDashboard,
  BookOpenCheck,
  FolderClock,
  Luggage,
  CircleFadingArrowUp,
} from "lucide-react";

// import DashboardIcon from "@mui/icons-material/Dashboard";
// import SchoolIcon from "@mui/icons-material/School";
// import LuggageIcon from "@mui/icons-material/Luggage";
// import AssignmentIcon from "@mui/icons-material/Assignment";

export const trainerMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", linkName: "dashboard" },
  { icon: BookOpenCheck, label: "Classes", linkName: "classes" },
  { icon: FolderClock, label: "History", linkName: "trainerhistory" },
  {
    icon: CircleFadingArrowUp,
    label: "Leave Request",
    linkName: "leaverequest",
  },
];
