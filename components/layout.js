import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import EventIcon from "@mui/icons-material/Event";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";

import { useRouter } from "next/router";
import { useState } from "react";

export default function Layout({ children, user }) {
  const router = useRouter();
  const [value, setValue] = useState();
  const views = createViews(user);
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Avatar style={{ marginLeft: "12px" }}>
            {user?.name?.charAt?.(0)}
          </Avatar>
          {user ? (
            <Typography style={{ flexGrow: 1 }}>
              שלום {user.name} 👋{" "}
            </Typography>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const createViews = (user) => [
  { label: "התחברות", icon: <LoginIcon />, route: "/login" },
  ...(user
    ? [
        {
          label: "העדפות",
          icon: <SettingsAccessibilityIcon />,
          route: "/preferences",
        },
      ]
    : []),
  { label: "שיבוצים", icon: <EventIcon />, route: "/schedule" },
];
