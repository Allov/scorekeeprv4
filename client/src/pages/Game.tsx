import React, { useState } from 'react';
import { motion, /*PanInfo,*/ useAnimation, /*Reorder*/ } from 'framer-motion'
import { UserAddIcon, RefreshIcon, ShareIcon, PencilAltIcon } from '@heroicons/react/outline'

const animation = {
  in: {
    y: 0,
    opacity: 1
  },
  initial: {
    y: -100,
    opacity: 0
  },
  out: {
    opacity: 0
  }
}

const playerAnimation = {
  in: {
    x: 0,
    opacity: 1
  },
  out: {
    x: 50,
    opacity: 0
  }
}

// function Player(props: { index: number, name: string }) {
//   return (
//     <motion.div variants={playerAnimation} transition={{ delay: props.index * 0.1 }} className="bg-slate-300 rounded h-[8vh] w-full p-1 flex items-center">
//       <p className="text-lg font-bold">{props.name}</p>
//     </motion.div>
//   )
// }


function Player(props: { index: number, name: string, score: number }) {
  var controls = useAnimation();

  return (
    <motion.div
      // drag="x"
      // dragDirectionLock
      // onDragEnd={handleDragEnd}
      className="bg-white border-2 border-slate-500 rounded h-14 w-full p-2 flex items-center justify-between space-x-5"
      animate={controls}
    >
      {/* <input type="text" className="text-lg font-bold" value={props.name} /> */}
      <p className="text-lg font-bold">{props.name}</p>
      <p className={`text-3xl font-bold ${props.score < 0 ? 'text-red-900' : 'text-green-900'}`}>{props.score < 0 ? props.score : `+${props.score}`}</p>
    </motion.div>
  )
}

function MenuButton(props: { onClick?: React.MouseEventHandler, children: React.ReactNode }) {
  return (
    <button onClick={props.onClick} className="border-slate-100 h-full w-full flex flex-col justify-center items-center text-xs">
      {props.children}
    </button>
  )
}

function Game() {

  const [players, /*setPlayers*/] = useState([0, 1, 2, 3]) // useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

  // function onDelete(index: number) {

  // }

  return (
    <>
      <div className="game-page-height w-full flex justify-start p-4 overflow-x-hidden">
        <motion.div initial="initial" animate="in" exit="out" variants={animation} className="flex flex-col w-[100vw] space-y-5">
          <h1 className="text-3xl dark:text-slate-100 text-slate-900">
            Game name
          </h1>
          {/* <Reorder.Group values={players} drag="y" dragDirectionLock onReorder={setPlayers} className="w-full space-y-5">
            {players.map((player, i) => (
              <Reorder.Item key={player} value={player}>
                <Player index={i} name={`Player ${player + 1}`} score={0} />
              </Reorder.Item>
            ))}
            </Reorder.Group> */}
          {players.map((player, i) => {
            return (
              <motion.div key={player} initial="out" animate="in" exit="out" variants={playerAnimation} transition={{ delay: i * .1 }}>
                <Player index={player} name={`Player ${player + 1}`} score={0} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
      <motion.footer initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="block fixed bottom-0 z-50 w-full keyboard-hidden sapin">
        <div className="flex justify-between text-slate-100 bg-gradient-to-b from-slate-900 to-slate-800 h-[10vh]">
          <MenuButton onClick={() => navigator.share({ title: 'sapin', text: 'sapppppin', url: 'https://sapin.com' })}>
            <ShareIcon className="h-5 w-5" />
            Share Game
          </MenuButton>
          <MenuButton>
            <PencilAltIcon className="h-5 w-5" />
            Game Settings
          </MenuButton>
          <MenuButton>
            <RefreshIcon className="h-5 w-5" />
            Reset Scores
          </MenuButton>
          <MenuButton>
            <UserAddIcon className="h-5 w-5" />
            Add Player
          </MenuButton>
        </div>
      </motion.footer>
    </>
  )
}

export default Game
