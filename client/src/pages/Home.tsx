import { motion } from 'framer-motion'
import Card from '../components/Card';

const animation = {
  in: {
    y: 0,
    opacity: 1
  },
  initial: {
    opacity: 0
  },
  out: {
    opacity: 0,
    y: -100
  }
}

function Home() {
  return (
    <div className="page-height w-[100vw] flex items-center">
      <motion.div initial="initial" animate="in" exit="out" variants={animation} className="snap-x w-full overflow-x-scroll flex space-x-[5vw] px-[10vw] no-scrollbar">
        {[1, 2, 3, 4, 5].map((_, i) => <Card key={i} />)}
      </motion.div>
    </div>
  );
}

export default Home;
