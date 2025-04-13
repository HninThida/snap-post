import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useApp } from "../ThemedApp";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postLogin } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const usernameInput = useRef();
  const { setAuth } = useApp();
  const passwordInput = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    const username = usernameInput.current.value;
    const password = passwordInput.current.value;
    if (!username || !password) {
      setError(" username and password required");
      return false;
    }
    login.mutate({ username, password });
  };

  const login = useMutation({
    mutationFn: async ({ username, password }) => postLogin(username, password),

    onError: async () => {
      setError("Incorrect username or password");
    },
    onSuccess: async (result) => {
      setAuth(result.user);
      localStorage.setItem("token", result.token);
      navigate("/");
    },
  });

  return (
    <Box>
      <Typography variant="h3">Login</Typography>
      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <form
        onSubmit={(e) => {
          handleSubmit();
          e.preventDefault();
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <TextField
            placeholder="Username"
            fullWidth
            inputRef={usernameInput}
          />
          <TextField
            type="password"
            inputRef={passwordInput}
            placeholder="Password"
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
}
