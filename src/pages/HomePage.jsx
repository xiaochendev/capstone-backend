import React, { useEffect, useState } from "react";
import MovieDisplay from "../components/MovieDisplay";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const API_KEY = import.meta.env.VITE_OMDB_API_KEY; // for Vite, all env variable must start w VITE_
  // State to hold movie data
  const [movies, setMovies] = useState([]);  // used [] instead of null, so no mistake when calling map
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // navigate hook

  const popularTitles = [
    "Clueless",
    "Titanic",
    "Test",
    "Mean Girls",
    "The Dark Knight",
    "Best",
  ];

  // getPopularMovies
  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true);
      try {
        const movieData = await Promise.all(
            popularTitles.map(async (title) => {
              const response = await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`
              );
              return await response.json();
            })
          );
          setMovies(movieData);
        } catch (error) {   
          console.error('Error fetching movies:', error.message);
          setMovies([]);     
        } finally {
        setLoading(false);
        }
      };
      
      fetchPopularMovies();
    }, []);

  const handleClick = (title) => {
    navigate(`/movie?q=${encodeURIComponent(title)}`);
  };

  return (
    <div>
      <h1>Popular Movies in OMDB</h1>

      {loading && <h2>Loading...</h2>}

      {/* Movies found */}
      {!loading && movies.length > 0 && (
        <div className='movies-container'>
          {movies && movies.map((movie, index) => (
            <div key={index} onClick={() => handleClick(movie.Title)} style={{ cursor: 'pointer' }}>
              <MovieDisplay movie={movie} />
            </div>
          ))}
        </div>
      )}

      {/* Movies not found */}
      {!loading && movies.length === 0 && (
        <p style={{ color: "red" }}>Coming soon...</p>
      )}

    </div>
  );
}
