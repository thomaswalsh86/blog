import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Travel from "./pages/travel";
import Login from "./pages/login";
import Journey from './pages/journey';
import Home from './pages/home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="Home" element={<Home />} />
        <Route path="journey" element={<Journey />} />
        <Route path="travel" element={<Travel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;