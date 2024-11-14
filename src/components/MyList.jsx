import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useBookmarks } from "./BookMarkContext";

// Main component for displaying a list of bookmarked movies
const MyList = ({ bookmarkedMovies, setBookmarkedMovies }) => {
  const { toggleBookmark } = useBookmarks();
  const [userBookmarks, setUserBookmarks] = useState([]);

  // Effect to load bookmarks from local storage when component mounts
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const users = JSON.parse(localStorage.getItem("users"));
      const currentUser = users.find(
        (user) => user.email === loggedInUser.email
      );
      if (currentUser) {
        setUserBookmarks(currentUser.bookmarkedMovies || []);
      }
    }
  }, []);

  // Function to handle toggling bookmarks for a movie
  const handleToggleBookmark = (movie) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const users = JSON.parse(localStorage.getItem("users"));
      const currentUserIndex = users.findIndex(
        (user) => user.email === loggedInUser.email
      );
      if (currentUserIndex !== -1) {
        const updatedUser = { ...users[currentUserIndex] };
        updatedUser.bookmarkedMovies = updatedUser.bookmarkedMovies || [];

        // Check if the movie is already bookmarked
        if (
          updatedUser.bookmarkedMovies.some((bm) => bm.imdbID === movie.imdbID)
        ) {
          // If it is remove it from bookmarks
          updatedUser.bookmarkedMovies = updatedUser.bookmarkedMovies.filter(
            (bm) => bm.imdbID !== movie.imdbID
          );
        } else {
          // Otherwise, add it to bookmarks
          updatedUser.bookmarkedMovies.push(movie);
        }

        // Update users array
        users[currentUserIndex] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));

        setUserBookmarks(updatedUser.bookmarkedMovies);
        setBookmarkedMovies(updatedUser.bookmarkedMovies);
      }
    } else {
      toggleBookmark(movie);
    }
  };

  // Render message if no bookmarks are found
  if (!userBookmarks || userBookmarks.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ color: "white", marginBottom: 2 }}>
          No bookmarked movies found.
        </Typography>
      </Box>
    );
  }

  return (
    // Render bookmarked movies
    <Box sx={{ p: 3 }}>
      {/* Title of the bookmarks section */}
      <Typography variant="h4" sx={{ color: "white", marginBottom: 2 }}>
        My Bookmarked Movies
      </Typography>

      {/* Grid layout for cards */}
      <Grid container spacing={3} columns={10}>
        {userBookmarks.map((movie) => (
          <Grid item size={{ xs: 10, md: 4, sm: 6, lg: 2 }} key={movie.imdbID}>
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
                  borderRadius: "20px",
                  margin: "0 auto",
                }}
              />
              <CardContent>
                <Typography
                  variant="h9"
                  component="div"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {movie.Title}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {movie.Year}
                </Typography>
                <IconButton
                  onClick={() => handleToggleBookmark(movie)}
                  sx={{ color: "red", marginTop: 2 }}
                  aria-label="bookmark"
                >
                  {userBookmarks.some((bm) => bm.imdbID === movie.imdbID) ? (
                    <BookmarkIcon />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyList;
