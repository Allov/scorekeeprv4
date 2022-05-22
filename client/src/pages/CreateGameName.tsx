import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, NavigationType, useNavigationType } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setName } from './createGameSlice'

const animation = {
  in: {
    y: 0,
    opacity: 1
  },
  initial: {
    y: 100,
    opacity: 0
  },
  out: {
    opacity: 0,
    y: -100
  }
}

const animationBack = {
  in: {
    y: 0,
    opacity: 1
  },
  initial: {
    y: -100,
    opacity: 0
  },
  out: {
    opacity: 0,
    y: 100
  }
}

function CreateGameName() {

  var navigationType = useNavigationType();

  const gameName = useSelector((state: RootState) => state.createGame.name)
  const dispatch = useDispatch();

  const [inputGameName, setInputGameName ] = useState(gameName)

  function validateName(e: React.FocusEvent<HTMLInputElement>) {
    setInputGameName(e.target.value)
    dispatch(setName(e.target.value))
  }

  function updateInternalState(e: React.FocusEvent<HTMLInputElement>) {
    setInputGameName(e.target.value)
  }

  return (
    <div className="page-height w-[100vw] flex justify-center items-center">
      <motion.div initial="initial" animate="in" exit="out" variants={navigationType == NavigationType.Pop ? animationBack : animation} className="flex flex-col space-y-[5vh] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-3xl dark:text-slate-100 text-slate-900 text-center">
          Enter a name
        </h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2 sr-only" htmlFor="username">
              Game name
            </label>
            <input
              onBlur={validateName}
              onChange={updateInternalState}
              value={inputGameName}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="game-name" type="text" placeholder="Game name"
            />
          </div>
          <div className="flex items-center justify-end">
            <Link to="/create-game-player-count" className="bg-slate-900 text-slate-100 hover:bg-slate-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Player Count {'>'}
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateGameName;
