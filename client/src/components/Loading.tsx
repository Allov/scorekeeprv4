import { motion } from "framer-motion";

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

function Loading() {
  return (
    <motion.section initial="initial" animate="in" exit="out" variants={animation} className="z-50 absolute top-0 left-0 h-full w-full flex flex-col space-y-5 justify-center items-center bg-slate-100 rounded-lg p-10">
      <span className="animate-bounce text-3xl">Creating...</span>
      <svg className="animate-spin-slow h-48 w-48" viewBox="0 0 192 192">
        <circle className="stroke-slate-400" cx="96" cy="96" r="84" fill="none" strokeWidth="6"></circle>
        <circle className="stroke-slate-300" cx="96" cy="96" r="84" fill="none" strokeWidth="6" strokeDasharray="48 84"></circle>
      </svg>
    </motion.section>
  )
}

export default Loading;
