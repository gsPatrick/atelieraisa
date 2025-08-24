// src/components/AnimatedThread.js (COMPLETO E CORRIGIDO)
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './AnimatedThread.module.css';

export default function AnimatedThread() {
  const { scrollYProgress } = useScroll();
  // MUDANÇA: A animação agora se completa muito antes, em 70% do scroll da página,
  // que é aproximadamente onde a seção da galeria começa a aparecer.
  const pathLength = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);

  return (
    // MUDANÇA: Reduzimos drasticamente a altura do SVG para corresponder ao novo container
    <svg className={styles.threadSvg} viewBox="0 0 500 1800" preserveAspectRatio="none">
      <motion.path
        // MUDANÇA: Encurtamos o caminho do SVG
        d="M 250,0 
           C 250,100 100,150 250,250 
           S 400,350 250,450
           S 100,550 250,650
           S 400,750 250,850
           S 100,950 250,1050
           S 400,1150 250,1250
           S 100,1350 250,1450
           L 250,1800"
        fill="none"
        stroke="url(#thread-gradient)"
        strokeWidth="3"
        style={{ pathLength }}
        initial={{ pathLength: 0 }}
      />
      <defs>
        <linearGradient id="thread-gradient" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="#F4E4BC" />
          <stop offset="50%" stopColor="#E8B4B8" />
          <stop offset="100%" stopColor="#F8D7DA" />
        </linearGradient>
      </defs>
    </svg>
  );
}