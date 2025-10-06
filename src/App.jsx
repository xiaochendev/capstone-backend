import { Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/Nav/NavBar';

import MoviePage from './pages/MoviePage';
import PeoplePage from './pages/PeoplePage';
import NotFound from './pages/NotFound';
import HomePage from './pages/HomePage';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie" element={<MoviePage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;