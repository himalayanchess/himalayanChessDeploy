import {
  LayoutDashboard,
  BookOpenCheck,
  CircleUser,
  Users,
  BookCopy,
  School,
  Component,
  Luggage,
  LayoutList,
  CalendarCheck2,
} from "lucide-react";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import AutoStoriesIcon from "@mui/icons-material/AutoStories";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import GroupsIcon from "@mui/icons-material/Groups";
// import SchoolIcon from "@mui/icons-material/School";
// import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
// import LuggageIcon from "@mui/icons-material/Luggage";

export const superadminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", linkName: "dashboard" },
  { icon: CalendarCheck2, label: "Attendance", linkName: "attendance" },
  { icon: BookOpenCheck, label: "Assign Class", linkName: "classes" },
  { icon: CircleUser, label: "Users", linkName: "users" },
  { icon: BookCopy, label: "Courses", linkName: "courses" },
  { icon: School, label: "Projects", linkName: "projects" },
  { icon: Component, label: "Batches", linkName: "batches" },
  {
    icon: Users,
    label: "Students",
    linkName: "students",
  },
  { icon: LayoutList, label: "Activity Records", linkName: "activityrecords" },
  {
    icon: Luggage,
    label: "Leave Approval",
    linkName: "leaveapproval",
  },
];
