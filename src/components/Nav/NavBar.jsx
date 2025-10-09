import { Link } from "react-router-dom";
import style from './Navbar.module.css'

export default function NavBar() {
  return (
    <nav className={style.navbar}>
      <ul className={style.navItems}>
        <li className={style.left}><Link to="/">Home</Link></li>
        <li><Link to="/movie">Search</Link></li>
        <li><Link to="/people">Big Fan of Star Wars</Link></li>
      </ul>
    </nav>
  );
}