export default function Person({name, height, birth_year}) {
  return (
    <div className="card1">
        <h2>{name}</h2>
          <p>Height: {height} cm</p>
          <p>Birth Year: {birth_year}</p>
    </div>
  );
}
