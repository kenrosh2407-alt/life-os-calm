import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Logo({ size = 96 }) {
  return (
    <motion.div
      className="logo-container calm-glow"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #66A6FF 0%, #89F7FE 100%)',
        borderRadius: `${size * 0.24}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000'
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Heart size={size * 0.4} fill="currentColor" />
    </motion.div>
  );
}