import { useApp } from "../ThemedApp";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkModeOutlined as DarkModeIcon,
  Search,
  Notifications,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotis } from "../libs/fetcher";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const {
    showForm,
    setShowForm,
    mode,
    setMode,
    showDrawer,
    setShowDrawer,
    auth,
  } = useApp();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["notis", auth],
    queryFn: fetchNotis,
  });

  function notiCount() {
    if (!auth) return 0;
    if (isLoading || isError) return 0;
    return data.filter((noti) => !noti.read).length;
  }
  auth !== null && notiCount();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setShowDrawer(!showDrawer)}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          sx={{ flexGrow: 1, ml: 2, color: "text.fade", cursor: "pointer" }}
          onClick={() => {
            navigate("/");
          }}
        >
          SnapPost
        </Typography>

        <Box>
          {auth && currentPath === "/" && (
            <IconButton color="inherit" onClick={() => setShowForm(!showForm)}>
              <AddIcon />
            </IconButton>
          )}
          <IconButton color="inherit" onClick={() => navigate("/search")}>
            <Search />
          </IconButton>
          {auth && (
            <IconButton color="inherit" onClick={() => navigate("/notis")}>
              <Badge color="error" badgeContent={notiCount()}>
                <Notifications />
              </Badge>
            </IconButton>
          )}
          {mode === "dark" ? (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMode("light")}
            >
              <LightModeIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMode("dark")}
            >
              <DarkModeIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
