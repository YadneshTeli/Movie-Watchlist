import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MyList from "./components/MyList";
import { BookmarkProvider } from "./components/BookMarkContext";
import InfoPage from "./components/InfoPage";
import { supabase } from "./components/supabaseClient";

function App() {
  const [session, setSession] = useState(null);
  const [movies, setMovies] = useState([]);
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);

  useEffect(() => {
    // Check for an existing session
    const storedSession = localStorage.getItem("supabase_session");

    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          localStorage.setItem("supabase_session", JSON.stringify(session));
          setSession(session);
        } else {
          localStorage.removeItem("supabase_session");
          setSession(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
