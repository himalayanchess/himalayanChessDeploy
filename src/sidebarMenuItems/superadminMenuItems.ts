import { Home, Settings, User } from "lucide-react";
export const superadminMenuItems = [
  { icon: Home, label: "Dashboard", linkName: "dashboard" },
  { icon: Home, label: "Users", linkName: "users" },
  { icon: User, label: "Courses", linkName: "courses" },
  {
    icon: Settings,
    label: "Settings",
    hasDropdown: true,
    options: ["Account", "Privacy"],
  },
];
