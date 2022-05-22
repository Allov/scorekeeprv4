import { motion } from 'framer-motion'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { setPlayerCount } from './createGameSlice';
import Loading from '../components/Loading'
import { useMutation, gql } from '@apollo/client';

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

let backward = false

const createGameMutation = gql`
  mutation CreateGame($name: String, $playerCount: Int) {
    createGame(name: $name, playerCount: $playerCount) {
      id,
      shareId,
    }
  }
`

function CreateGamePlayerCount() {
  var navigate = useNavigate()

  const playerCount = useSelector((state: RootState) => state.createGame.playerCount)
  const gameName = useSelector((state: RootState) => state.createGame.name)
  const dispatch = useDispatch()

  const [inputPlayerCount, setInputPlayerCount] = useState(playerCount.toString())
  // const [loading, setLoading] = useState(false)

  const [createGame, { loading }] = useMutation(createGameMutation)

  function validatePlayerCount(e: React.FocusEvent<HTMLInputElement>) {
    if (Number(e.target.value) > 0) {
      dispatch(setPlayerCount(Number(e.target.value)))
    }
  }

  function updateInternalState(e: React.FocusEvent<HTMLInputElement>) {
    if (e.target.value == '' || Number(e.target.value) > 0) {
      setInputPlayerCount(e.target.value)
    } else {
      setInputPlayerCount(inputPlayerCount)
    }
  }

  function onClickBack() {
    backward = true;
    navigate(-1)
  }

  async function onClickCreate() {
    backward = false

    const { data } = await createGame({
      variables: {
        name: gameName,
        playerCount
      }
    })

    navigate(`/game/${data.createGame.id}`)
  }

  function getBackward() {
    return backward;
  }

  const main = (
    <div className="page-height w-[100vw] flex justify-center items-center">
      <motion.div initial="initial" animate="in" exit="out" custom={getBackward} variants={animation} className="flex flex-col space-y-[5vh] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-3xl dark:text-slate-100 text-slate-900 text-center">
          How many players?
        </h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2 sr-only" htmlFor="username">
              Number of players
            </label>
            <input
              onBlur={validatePlayerCount}
              onChange={updateInternalState}
              value={inputPlayerCount}
              min="0"
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="game-player-count"
              placeholder="2"
            />
          </div>
          <div className="flex items-center justify-between space-x-1">
            <button onClick={onClickBack} className="bg-slate-100 text-slate-900 hover:bg-slate-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              {'<'} Back
            </button>
            <button
              onClick={onClickCreate}
              disabled={loading}
              className="bg-slate-900 text-slate-100 hover:bg-slate-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex"
              type="button"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )

  const loadingComponent = <Loading />

  return loading ? loadingComponent : main
}

export default CreateGamePlayerCount;
