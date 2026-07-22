import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TextRotateProps {
  words: string[];
  interval?: number;
  className?: string;
}

export const TextRotate: React.FC<TextRotateProps> = ({
  words,
  interval = 2400,
  className = '',
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span className={`inline-block relative overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: '100%', opacity: 0, filter: 'blur(8px)', rotateX: -45 }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)', rotateX: 0 }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(8px)', rotateX: 45 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block text-[#D4FF00] font-black tracking-tight drop-shadow-[0_0_25px_rgba(212,255,0,0.3)]"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
