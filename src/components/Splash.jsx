import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function Splash({ show, onDone, userName }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
          className="splash"
        >
          <div className="splash-bg" />
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="splash-inner">
            <div className="floaty"><Logo size={108} /></div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="splash-sub">
              {userName ? `Welcome back, ${userName}` : 'Life‑OS • Superapp'}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}