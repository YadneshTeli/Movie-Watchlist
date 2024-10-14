import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MyList from "./components/MyList";
import { BookmarkProvider } from "./components/BookMarkContext";
import InfoPage from "./components/InfoPage";

function App() {
  const [movies, setMovies] = useState([]);
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);

  return (
    <>
      <BookmarkProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  movies={movies}
                  setMovies={setMovies}
                  bookmarkedMovies={bookmarkedMovies}
                  setBookmarkedMovies={setBookmarkedMovies}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/mylist"
              element={<MyList bookmarkedMovies={bookmarkedMovies} />}
            />
            <Route path="/home" element={<Home />} />
            <Route path="/info/:id" element={<InfoPage />} />
          </Routes>
        </Router>
      </BookmarkProvider>
    </>
  );
}

export default App;
