import { Link } from "react-router-dom";

export default function NavBar() {
    let style = {
        padding: 0,
        width: '100%',
        margin: 20,
        display: 'flex',
        justifyContent: 'space-between',
        listStyle: 'none'
    }

  return (
    <nav width={'100%'}>
      <ul style={style}>
        <Link to={'/'}>
          <li>Home</li>
        </Link>
        <Link to={'/movie'}>
          <li>Search</li>
        </Link>
        <Link to={'/people'}>
          <li>Big Fan of Star Wars</li>
        </Link>
      </ul>
    </nav>
  );
}