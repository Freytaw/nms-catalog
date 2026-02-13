import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import { Rocket, Globe, Database, Map, Home, MapPin } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Sectors from './pages/Sectors'
import Systems from './pages/Systems'
import Planets from './pages/Planets'
import Creatures from './pages/Creatures'
import Bases from './pages/Bases'
import PointsOfInterest from './pages/PointsOfInterest'
import { SectorDetail, SystemDetail, PlanetDetail, CreatureDetail, BaseDetail, PointOfInterestDetail } from './pages/DetailPages'
import './index.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <div className="nav-container">
            <Link to="/" className="nav-brand">
              <Rocket size={24} />
              NMS Catalogue
            </Link>
            <ul className="nav-links">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Home size={18} />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/sectors" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Map size={18} />
                  Secteurs
                </NavLink>
              </li>
              <li>
                <NavLink to="/systems" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Database size={18} />
                  Systèmes
                </NavLink>
              </li>
              <li>
                <NavLink to="/planets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Globe size={18} />
                  Planètes
                </NavLink>
              </li>
              <li>
                <NavLink to="/creatures" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Créatures
                </NavLink>
              </li>
              <li>
                <NavLink to="/bases" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Bases
                </NavLink>
              </li>
              <li>
                <NavLink to="/points-of-interest" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <MapPin size={18} />
                  Points d'Intérêt
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sectors" element={<Sectors />} />
            <Route path="/sectors/:id" element={<SectorDetail />} />
            <Route path="/systems" element={<Systems />} />
            <Route path="/systems/:id" element={<SystemDetail />} />
            <Route path="/planets" element={<Planets />} />
            <Route path="/planets/:id" element={<PlanetDetail />} />
            <Route path="/creatures" element={<Creatures />} />
            <Route path="/creatures/:id" element={<CreatureDetail />} />
            <Route path="/bases" element={<Bases />} />
            <Route path="/bases/:id" element={<BaseDetail />} />
            <Route path="/points-of-interest" element={<PointsOfInterest />} />
            <Route path="/points-of-interest/:id" element={<PointOfInterestDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
