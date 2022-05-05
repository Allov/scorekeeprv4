import React from 'react'
import { Link } from 'react-router-dom'

function Card() {
  return (
    <div className="snap-center py-4">
    <div className="w-[80vw] h-[50vh] bg-[#EA684B] dark:bg-orange-100 rounded-xl drop-shadow-card flex flex-col items-center">
      <div className="h-80 flex items-center">
        <h1 className="text-6xl sm:text-md dark:text-slate-100 text-slate-900 text-center font-bold">
          DUTCH
        </h1>
      </div>
      <div className="flex items-end justify-center">
        <Link to="/create-game" className="h-10 w-32 hover:bg-slate-700 text-white font-bold text-3xl rounded focus:outline-none focus:shadow-outline bg-auto bg-[url('button-down.svg')]">
          <span className="align-middle hidden">Create game</span>
        </Link>
      </div>
    </div>
  </div>
  )
}


export default Card;
