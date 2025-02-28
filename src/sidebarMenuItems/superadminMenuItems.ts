import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupsIcon from "@mui/icons-material/Groups";
export const superadminMenuItems = [
  { icon: DashboardIcon, label: "Dashboard", linkName: "dashboard" },
  { icon: PeopleIcon, label: "Users", linkName: "users" },
  { icon: AutoStoriesIcon, label: "Courses", linkName: "courses" },
  { icon: ReceiptLongIcon, label: "Projects", linkName: "projects" },
  { icon: GroupsIcon, label: "Batches", linkName: "batches" },

  {
    icon: AutoStoriesIcon,
    label: "Settings",
    hasDropdown: true,
    options: ["Account", "Privacy"],
  },
];
