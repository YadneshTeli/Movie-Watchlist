import React, { useState, useEffect, useCallback } from "react";
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
  const [searchTerm, setSearchTerm] = useState("avengers");
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Track page number for infinite scroll
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const fetchMovies = async (searchTerm, newPage = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchTerm}&page=${newPage}&apikey=3058d4c6`
      );
      const newMovies = response.data.Search || [];
      if (newPage === 1) {
        setMovies(newMovies);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm, 1);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(searchTerm, page);
    }
  }, [page]);

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

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies(searchTerm, 1);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason !== "clickaway") setOpenSnackbar(false);
  };

  const handleBookmarkToggle = (movie) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      setOpenSnackbar(true);
      return;
    }
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = storedUsers.findIndex(
      (user) => user.email === loggedInUser.email
    );
    if (userIndex !== -1) {
      const userBookmarks = storedUsers[userIndex].bookmarkedMovies || [];
      if (userBookmarks.some((m) => m.imdbID === movie.imdbID)) {
        storedUsers[userIndex].bookmarkedMovies = userBookmarks.filter(
          (m) => m.imdbID !== movie.imdbID
        );
      } else {
        userBookmarks.push(movie);
        storedUsers[userIndex].bookmarkedMovies = userBookmarks;
      }
      localStorage.setItem("users", JSON.stringify(storedUsers));
      setBookmarkedMovies(storedUsers[userIndex].bookmarkedMovies);
    }
  };

  const handleKnowMore = (movie) => {
    navigate(`/info/${movie.imdbID}`, { state: { movie } });
  };

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
                          : "https://via.placeholder.com/200x300?text=No+Image+Available"
                      }
                      alt={movie.Title}
                      sx={{
                        width: "200px",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        margin: "0 auto",
                        position: "relative",
                      }}
                    />
                    {movie.Poster === "N/A" && (
                      <Typography
                        variant="h6"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          textAlign: "center",
                        }}
                      >
                        {movie.Title}
                      </Typography>
                    )}
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
          {loading && <Typography color="white">Loading...</Typography>}
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
