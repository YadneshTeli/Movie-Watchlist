import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

// dark theme for the app
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

const InfoPage = () => {
  const { state } = useLocation();
  const { movie } = state || {};
  const navigate = useNavigate();

  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // function to fetch movie details from the API using IMDb ID
  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=3058d4c6`
      );
      setMovieDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setLoading(false);
    }
  };

  // useeffect hook to fetch movie details when the movie object is available
  useEffect(() => {
    if (movie && movie.imdbID) {
      fetchMovieDetails(movie.imdbID);
    }
  }, [movie]);

  // If no movie data is available display a message
  if (!movie || !movie.imdbID) {
    return <Typography color="white">No movie data available.</Typography>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      {" "}
      {/* Apply the dark theme */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          p: 6,
          height: "100vh"
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              height: "100vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="primary" /> {/* loader */}
          </Box>
        ) : (
          <Card
            sx={{
              backgroundColor: "#1e1e1e",
              color: "white",
              borderRadius: "20px",
              padding: "20px",
              height: "80vh"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: "20px",
              }}
            >
              {/* display movie poster */}
              <CardMedia
                component="img"
                image={
                  movieDetails.Poster !== "N/A"
                    ? movieDetails.Poster
                    : "https://via.placeholder.com/300x450"
                }
                alt={movieDetails.Title}
                sx={{
                  width: { xs: "100%", md: "350px" },
                  height: { xs: "auto", md: "400px" },
                  objectFit: "cover",
                  borderRadius: "10px",
                  margin: "0 auto",
                }}
              />

              {/* card content area */}
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", marginBottom: "20px" }}
                  >
                    {movieDetails.Title}
                  </Typography>

                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    <strong>Release Year:</strong> {movieDetails.Year}
                  </Typography>

                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    <strong>Genre:</strong> {movieDetails.Genre}
                  </Typography>

                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    <strong>Director:</strong> {movieDetails.Director}
                  </Typography>

                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    <strong>Actors:</strong> {movieDetails.Actors}
                  </Typography>

                  <Typography variant="body2" sx={{ marginTop: "20px" }}>
                    <strong>Plot:</strong>{" "}
                    {movieDetails.Plot || "No plot available."}
                  </Typography>
                </Box>

                {/* Back button to return to the main page */}
                <Box sx={{ marginTop: "20px", textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(-1)}
                  >
                    Back to Main Page
                  </Button>
                </Box>
              </CardContent>
            </Box>
          </Card>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default InfoPage;
