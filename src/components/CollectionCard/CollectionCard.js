// src/components/CollectionCard.js

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './CollectionCard.module.css';

// Animação para os cards individuais que virá do componente pai
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  },
};

export default function CollectionCard({ title, image, href }) {
  return (
    <motion.div variants={cardVariants}>
      {/* O Link agora envolve todo o card e a className é aplicada diretamente a ele. */}
      <Link href={href} className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={image}
            alt={`Coleção de ${title} do Ateliê Raisa`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
          />
        </div>
        <div className={styles.overlay}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.link}>Ver Coleção</span>
        </div>
      </Link>
    </motion.div>
  );
}