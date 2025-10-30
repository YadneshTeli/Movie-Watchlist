import * as React from "react";
import PropTypes from "prop-types";
import {
  AppBar as MuiAppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  styled,
  ThemeProvider,
  createTheme,
  useTheme,
} from "@mui/material/styles";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import MyList from "./MyList";
import Login from "./Login";
import Mainpage from "./MainPage";
import Signup from "./Signup";
import { supabase } from "./supabaseClient";

// Width of the sidebar drawer
const drawerWidth = 240;

// when drawer opens these styles will be applied
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

// when drawer closes these styles will be applied
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Header for the drawer used to add a close button
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// AppBar styles adjusted when the drawer is open
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Drawer styles change when its open/closed
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Home({ bookmarkedMovies, setBookmarkedMovies }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [activeContent, setActiveContent] = React.useState("home");
  const [loggedInUser, setLoggedInUser] = React.useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  // Load the loggedin user from localStorage when the component mounts
  React.useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to open the drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // Function to close the drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Handles the menu click, switching between components
  const handleMenuClick = (content) => {
    setActiveContent(content);
  };

  // Logs out the user clearing from localStorage
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("supabase_session");
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setActiveContent("home");
    setLogoutDialogOpen(false);
    window.location.reload();
  };

  // Opens the logout confirmation dialog
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  // Closes the logout dialog
  const handleCloseDialog = () => {
    setLogoutDialogOpen(false);
  };

  return (
    //Main design and layout
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} sx={{ backgroundColor: "black" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[{ marginRight: 5 }, open && { display: "none" }]}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h5"
              noWrap
              component="div"
              color="red"
              fontWeight="bold"
            >
              WATCHLISTS
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer with navigation options */}
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />

          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <List>
              {[
                { text: "Home", icon: <HomeIcon />, path: "home" },
                { text: "My List", icon: <ListAltIcon />, path: "mylist" },
              ].map(({ text, icon, path }) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    onClick={() => handleMenuClick(path)}
                    sx={[
                      { minHeight: 48, px: 2.5 },
                      open
                        ? { justifyContent: "initial" }
                        : { justifyContent: "center" },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        { minWidth: 0, justifyContent: "center" },
                        open ? { mr: 3 } : { mr: "auto" },
                      ]}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <List>
              {/* Logout or login option depending on user status */}
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={
                    loggedInUser
                      ? handleLogoutClick
                      : () => handleMenuClick("login")
                  }
                  sx={[
                    { minHeight: 48, px: 2.5 },
                    open
                      ? { justifyContent: "initial" }
                      : { justifyContent: "center" },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      { minWidth: 0, justifyContent: "center" },
                      open ? { mr: 3 } : { mr: "auto" },
                    ]}
                  >
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={loggedInUser ? "Logout" : "Guest User"}
                    secondary={loggedInUser ? loggedInUser.username : ""}
                    sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Main content section that switches based on navigation */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {activeContent === "home" && <Mainpage />}
          {activeContent === "mylist" && (
            <MyList
              bookmarkedMovies={bookmarkedMovies}
              setBookmarkedMovies={setBookmarkedMovies}
            />
          )}
          {activeContent === "login" && (
            <Login
              setActiveContent={setActiveContent}
              setLoggedInUser={setLoggedInUser}
            />
          )}
          {activeContent === "signup" && (
            <Signup setActiveContent={setActiveContent} />
          )}
        </Box>
        <Dialog
          open={logoutDialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "black",
              color: "white",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to log out?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="red">
              Cancel
            </Button>
            <Button onClick={handleLogout} sx={{ color: "red" }} autoFocus>
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

Home.propTypes = {
  bookmarkedMovies: PropTypes.array.isRequired,
  setBookmarkedMovies: PropTypes.func.isRequired,
};

export default Home;
