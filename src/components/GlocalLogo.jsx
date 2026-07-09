import React from 'react';
import { motion } from 'framer-motion';
import './GlocalLogo.css';

export default function GlocalLogo({ isFirst = true, className = '' }) {
  const d = (n) => isFirst ? n : n * 0.08;

  return (
    <div className={`gl-logo ${className}`} aria-label="GLOCAL Foundation of Canada">

      {/* Globe — real image cropped from logo.png, scale-spring reveal */}
      <motion.img
        src="globe.png"
        alt=""
        aria-hidden="true"
        className="gl-globe"
        initial={{ scale: 0.72, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        transition={{ duration: d(0.6), delay: d(0.04), ease: [0.34, 1.3, 0.64, 1] }}
      />

      {/* Text */}
      <div className="gl-text">
        <motion.div
          className="gl-name"
          initial={{ opacity: 0, x: isFirst ? 18 : 5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: d(0.5), delay: d(0.3), ease: [0.2, 0, 0, 1] }}
        >
          GLOCAL
        </motion.div>
        <motion.div
          className="gl-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: d(0.4), delay: d(0.46), ease: [0.2, 0, 0, 1] }}
        >
          FOUNDATION OF CANADA
        </motion.div>
      </div>

    </div>
  );
}
