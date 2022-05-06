import { Routes, Route, Link, useLocation } from "react-router-dom"
import { MenuIcon } from '@heroicons/react/solid'
import CreateGame from './pages/CreateGame'
import CreateGamePlayerCount from './pages/CreateGamePlayerCount'
import Home from './pages/Home'
import Game from './pages/Game'
import './index.css'
import { AnimatePresence } from 'framer-motion'

function App() {
  var location = useLocation();
  return (
    <div className="w-full bg-slate-100 dark:bg-slate-100 flex flex-col justify-start items-center">
      <header className="top-0 z-50 h-[10vh] w-full pl-5 flex flex-shrink-0 items-center border-b-2 bg-gradient-to-t from-slate-200 to-white drop-shadow-md">
        <MenuIcon className="h-9 w-9 text-slate-900" />
        <h1 className="pl-2 text-xl font-bold">
          <Link to="/">scorekeepr</Link>
        </h1>
      </header>
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/create-game" element={<CreateGame />} />
          <Route path="/create-game-player-count" element={<CreateGamePlayerCount />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App;
