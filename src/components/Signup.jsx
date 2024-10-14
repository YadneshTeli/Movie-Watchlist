import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";

const Login = ({ setActiveContent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Function to handle Back button click
  const handleBackClick = () => {
    setActiveContent("home");
  };

  // Function to handle Login button click
  const handleLoginClick = () => {
    setActiveContent("login");
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    const storedUsers = localStorage.getItem("users");
    const usersArray = storedUsers ? JSON.parse(storedUsers) : [];

    const isEmailTaken = usersArray.some((user) => user.email === email);

    // If email is taken, show error Snackbar
    if (isEmailTaken) {
      setSnackbarMessage("Email is already registered.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const newUser = { username, email };

    usersArray.push(newUser);

    localStorage.setItem("users", JSON.stringify(usersArray));

    setUsername("");
    setEmail("");

    // Show success Snackbar
    setSnackbarMessage("Registration successful!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Function to close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    // signup layout
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 12,
          px: isMobile ? 2 : 4,
        }}
      >
        <Typography
          component="h1"
          variant={isMobile ? "h4" : "h3"}
          sx={{ mb: 6, fontWeight: "bold", textAlign: "center" }} // Add textAlign: 'center'
        >
          Sign up to your <span style={{ color: "#f44336" }}>account</span>
        </Typography>

        <Box
          component="form"
          noValidate
          sx={{ mt: 1, width: "100%" }}
          onSubmit={handleSubmit}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#f44336",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#f44336",
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#f44336",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#f44336",
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#f44336",
              "&:hover": {
                bgcolor: "#d32f2f",
              },
            }}
          >
            Sign In
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Button
              onClick={handleBackClick} // Handle back button click
              sx={{
                border: "1px solid #9e9e9e",
                color: "text.primary",
                "&:hover": {
                  borderColor: "#f44336",
                },
                width: isMobile ? "100%" : "auto",
              }}
            >
              Back
            </Button>
            <Typography variant="body2">
              Already have an account?{" "}
              <Typography
                component="span"
                onClick={handleLoginClick}
                sx={{
                  color: "#f44336",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Login
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Login;
