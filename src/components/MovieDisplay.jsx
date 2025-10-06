export default function MovieDisplay({ movie }){
  // Function to return loaded JSX
  const loaded = () => {
    return (
      <>
      <div className="movie-card">
        <h1>{movie.Title}</h1>
        <h2>{movie.Genre}</h2>
        {movie.Poster && movie.Poster !== "N/A" && ( 
          <img src={movie.Poster} alt={movie.Title} /> 
        )}
        <h2>{movie.Year}</h2>
      </div>
      </>
    );
  };

  // Function to return loading JSX
  const loading = () => {
    return <h1>No Movie to Display</h1>;
  };

  // Ternary operator will determine which functions JSX we will return
  return movie ? loaded() : loading();
}

