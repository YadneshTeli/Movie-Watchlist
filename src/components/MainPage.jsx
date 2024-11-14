import React, { useState, useEffect } from "react";
import {
  TextField,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import InfoIcon from "@mui/icons-material/Info";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from "react-router-dom";

//Using the dark theme frim mui
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#e50914",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
  },
});

// Styled TextField for search input with customized styles
const SearchBox = styled(TextField)(() => ({
  input: { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#e50914",
    },
    "&:hover fieldset": {
      borderColor: "#ff3333",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff3333",
    },
  },
}));

function MainPage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("insidious");
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Function to fetch movies from the OMDB API based on the search term
  const fetchMovies = async (searchTerm) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchTerm}&apikey=3058d4c6`
      );
      setMovies(response.data.Search || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Effect to fetch users bookmarked movies from local storage on component mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = storedUsers.find((u) => u.email === loggedInUser.email);
      if (user && user.bookmarkedMovies) {
        setBookmarkedMovies(user.bookmarkedMovies);
      }
    }
  }, [searchTerm]);

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchMovies(searchTerm.trim());
    } else {
      setMovies([]);
    }
  };

  // Function to close the snackbar notification
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Function to toggle bookmarking a movie
  const handleBookmarkToggle = (movie) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      setOpenSnackbar(true);
      return;
    }

    // Get users from local storage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = storedUsers.findIndex(
      (user) => user.email === loggedInUser.email
    );

    // Get the user's bookmarks
    if (userIndex !== -1) {
      const userBookmarks = storedUsers[userIndex].bookmarkedMovies || [];

      if (userBookmarks.some((m) => m.imdbID === movie.imdbID)) {
        const updatedBookmarks = userBookmarks.filter(
          (m) => m.imdbID !== movie.imdbID
        );
        storedUsers[userIndex].bookmarkedMovies = updatedBookmarks;
      } else {
        userBookmarks.push(movie);
        storedUsers[userIndex].bookmarkedMovies = userBookmarks;
      }

      localStorage.setItem("users", JSON.stringify(storedUsers));
      setBookmarkedMovies(storedUsers[userIndex].bookmarkedMovies);
    }
  };

  // Function to navigate to movie details page
  const handleKnowMore = (movie) => {
    navigate(`/info/${movie.imdbID}`, { state: { movie } });
  };

  // Fetch movies on initial render
  useEffect(() => {
    fetchMovies("insidious");
  }, []);

  return (
    
    <ThemeProvider theme={darkTheme}>
      {/* Main container */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {/* Header Title */}
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#ffffff", flexGrow: 1 }}
            >
              Movies and Series
            </Typography>

            {/* Search form */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <SearchBox
                variant="outlined"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{
                  width: { xs: "100%", sm: "80%", md: "300px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "50px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        type="submit"
                        aria-label="search"
                        edge="start"
                        sx={{ p: 1 }}
                      >
                        <SearchIcon sx={{ color: "#e50914" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Container for movie cards */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3} columns={10}>
            {movies.length > 0 ? (
              movies.slice(0, 20).map((movie, index) => (
                <Grid
                  item
                  size={{ xs: 10, md: 4, sm: 6, lg: 2 }}
                  key={movie.imdbID}
                >
                  <Card
                    sx={{
                      backgroundColor: "#121212",
                      color: "white",
                      height: "100%",
                      borderRadius: "20px",
                      padding: "20px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      loading="lazy"
                      image={
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://via.placeholder.com/200x300"
                      }
                      alt={movie.Title}
                      sx={{
                        width: "200px",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        margin: "0 auto",
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h8"
                        component="div"
                        sx={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        {movie.Title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                      >
                        {movie.Year}
                      </Typography>

                      <div className="flex justify-between gap-y-5">
                        <IconButton
                          onClick={() => handleBookmarkToggle(movie)}
                          sx={{ color: "red" }}
                          aria-label="bookmark"
                        >
                          {bookmarkedMovies.some(
                            (m) => m.imdbID === movie.imdbID
                          ) ? (
                            <BookmarkIcon />
                          ) : (
                            <BookmarkBorderIcon />
                          )}
                        </IconButton>
                        <IconButton
                          onClick={() => handleKnowMore(movie)}
                          sx={{ color: "white", marginLeft: "10px" }}
                          aria-label="know more"
                        >
                          <InfoIcon />
                        </IconButton>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" color="white">
                No movies found.
              </Typography>
            )}
          </Grid>
        </Box>

        {/* A snackbar message to login/register before bookmarking any movies */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="warning"
            sx={{ width: "100%" }}
          >
            Please register or log in to bookmark movies.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default MainPage;
