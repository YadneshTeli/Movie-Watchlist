import React, { createContext, useContext, useState } from "react";

// Here i created a new context for bookmarks to manage state globally
const BookmarkContext = createContext();

// BookmarkProvider will wrap components that need access to bookmark state
export const BookmarkProvider = ({ children }) => {
  // This State will hold the list of bookmarked movies
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  // This Function is used to add or remove a movie from bookmarks
  const toggleBookmark = (movie) => {
    if (bookmarkedMovies.some((m) => m.imdbID === movie.imdbID)) {
      setBookmarkedMovies(
        bookmarkedMovies.filter((m) => m.imdbID !== movie.imdbID)
      );
    } else {
      // If the movie isn't bookmarked, add it to the list
      setBookmarkedMovies([...bookmarkedMovies, movie]);
    }
  };

  return (
    // Providing the bookmark state and the toggle function to any component wrapped in this provider
    <BookmarkContext.Provider value={{ bookmarkedMovies, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);
