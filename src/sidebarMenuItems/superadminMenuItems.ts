import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

export const superadminMenuItems = [
  { icon: DashboardIcon, label: "Dashboard", linkName: "dashboard" },
  { icon: PeopleIcon, label: "Users", linkName: "users" },
  { icon: AutoStoriesIcon, label: "Courses", linkName: "courses" },
  {
    icon: AutoStoriesIcon,
    label: "Settings",
    hasDropdown: true,
    options: ["Account", "Privacy"],
  },
];
