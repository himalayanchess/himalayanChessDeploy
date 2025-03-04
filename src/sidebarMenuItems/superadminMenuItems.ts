import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
export const superadminMenuItems = [
  { icon: DashboardIcon, label: "Dashboard", linkName: "dashboard" },
  { icon: SchoolIcon, label: "Classes", linkName: "classes" },
  { icon: SupervisedUserCircleIcon, label: "Users", linkName: "users" },
  {
    icon: PeopleIcon,
    label: "Students",
    linkName: "students",
  },
  { icon: AutoStoriesIcon, label: "Courses", linkName: "courses" },
  { icon: ReceiptLongIcon, label: "Projects", linkName: "projects" },
  { icon: GroupsIcon, label: "Batches", linkName: "batches" },
];
