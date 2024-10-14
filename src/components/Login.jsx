import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";

// login component handles user login functionality
const Login = ({ setActiveContent, setLoggedInUser }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // function navigates to the home content when back button is clicked
  const handleBackClick = () => {
    setActiveContent("home");
  };

  // function navigates to the signup content when signup button is clicked
  const handleSignupClick = () => {
    setActiveContent("signup");
  };

  // function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // retrieve users from local storage
    const storedUsers = localStorage.getItem("users");
    const usersArray = storedUsers ? JSON.parse(storedUsers) : [];

    // check if the entered email matches an existing user
    const existingUser = usersArray.find((user) => user.email === email);

    // if user exists store the user in local storage
    if (existingUser) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          email: existingUser.email,
          username: existingUser.username,
        })
      );

      // update loggedin user state
      setLoggedInUser({
        email: existingUser.email,
        username: existingUser.username,
      });

      // display success snackbar message
      setSnackbarMessage(`Welcome back, ${existingUser.username}!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setActiveContent("home");
      setEmail("");
    } else {
      // if user is not found, show an error message
      setSnackbarMessage("User not found. Please sign up.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // function to handle closing of the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "1rem" : "0",
      }}
    >
      <Box
        sx={{
          maxWidth: "28rem",
          width: "100%",
          "& > *": { marginBottom: "2rem" },
          padding: isMobile ? "1rem" : "2rem",
        }}
      >
        {/* Title of the login form */}
        <div>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            Log in to your <span style={{ color: "#f44336" }}>account</span>
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
          {/* form elements */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              marginTop: "1rem",
            }}
          >
            <Box
              sx={{
                minWidth: "7rem",
                width: "100%",
                marginTop: isMobile ? "1rem" : "0",
              }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#f44336",
                  "&:hover": { backgroundColor: "#d32f2f" },
                  textTransform: "none",
                  fontSize: "0.875rem",
                }}
              >
                Sign in
              </Button>
            </Box>
          </Box>
        </form>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "1rem" : "0",
          }}
        >
          <Button
            onClick={handleBackClick}
            fullWidth={isMobile}
            sx={{
              backgroundColor: "black",
              color: "white",
              border: "1px solid #9e9e9e",
              "&:hover": { borderColor: "#f44336" },
              textTransform: "none",
            }}
          >
            Back
          </Button>

          <Typography
            variant="body2"
            sx={{ color: "#9e9e9e", textAlign: isMobile ? "center" : "right" }}
          >
            Don't have an account?{" "}
            <span
              onClick={handleSignupClick}
              style={{
                cursor: "pointer",
                color: "#f44336",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Sign up
            </span>
          </Typography>
        </Box>

        {/* snackbar for notifications */}
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
    </Box>
  );
};

export default Login;
