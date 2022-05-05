import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom';

const animation = {
  initial: {
    y: 100,
    opacity: 0
  },
  in: {
    y: 0,
    opacity: 1
  },
  out: (backward: () => boolean) => backward() ? { y: 100, opacity: 0 } : { y: 0, opacity: 0 }
}

let backward = false;

function CreateGamePlayerCount() {
  var navigate = useNavigate()

  function onClickBack() {
    backward = true;
    navigate(-1)
  }

  function onClickCreate() {
    backward = false;
  }

  function getBackward() {
    return backward;
  }

  return (
    <div className="page-height w-[100vw] flex justify-center items-center">
      <motion.div initial="initial" animate="in" exit="out" custom={getBackward} variants={animation} className="flex flex-col space-y-[5vh] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-3xl dark:text-slate-100 text-slate-900 text-center">
          New Game
        </h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Number of players
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="game-player-count" type="number" placeholder="2" />
          </div>
          <div className="flex items-center justify-between space-x-1">
            <button onClick={onClickBack} className="bg-slate-100 text-slate-900 hover:bg-slate-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              {'<'} Back
            </button>
            <Link to="/game/123" onClick={onClickCreate} className="bg-slate-900 text-slate-100 hover:bg-slate-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Create
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateGamePlayerCount;
