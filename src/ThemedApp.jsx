import { useState, createContext, useContext, useMemo, useEffect } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Snackbar,
} from "@mui/material";
import { deepPurple, grey } from "@mui/material/colors";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Template from "./Template";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Likes from "./pages/Likes";
import Comments from "./pages/Comments";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchVerify } from "./libs/fetcher";
import Search from "./components/Search";
import Notis from "./pages/Noti";
import AppSocket from "./AppWebSocket";

export const queryClient = new QueryClient();
const AppContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext);
}
export const api = import.meta.env.VITE_API;

export default function ThemedApp() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [globalMsg, setGlobalMsg] = useState(null);
  const [auth, setAuth] = useState(null);
  const [mode, setMode] = useState("dark");

  const verify = () => {
    fetchVerify().then((user) => {
      if (user) {
        setAuth(user);
      }
    });
  };

  useEffect(() => {
    verify();
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: deepPurple,
        banner: mode === "dark" ? grey[800] : grey[200],
        text: {
          fade: grey[500],
        },
      },
    });
  }, [mode]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Template />,
      children: [
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/likes/:id/:type",
          element: <Likes />,
        },
        {
          path: "/comments/:id",
          element: <Comments />,
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/notis",
          element: <Notis />,
        },
      ],
    },
  ]);
  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          showDrawer,
          setShowDrawer,
          showForm,
          setShowForm,
          globalMsg,
          setGlobalMsg,
          auth,
          setAuth,
          mode,
          setMode,
        }}
      >
        <Snackbar
          anchorOrigin={{
            horizontal: "center",
            vertical: "bottom",
          }}
          open={Boolean(globalMsg)}
          autoHideDuration={6000}
          onClose={() => setGlobalMsg(null)}
          message={globalMsg}
        />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <AppSocket />
        </QueryClientProvider>
        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
