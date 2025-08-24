// src/components/Hero/Hero.js

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

// Variante para o container principal que orquestra a animação dos filhos
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Atraso de 0.3s entre a animação de cada filho
      delayChildren: 0.2,   // Um pequeno atraso antes de começar a primeira animação
    },
  },
};

// Variante para os elementos de texto (título, parágrafo, botão)
const textVariants = {
  hidden: { opacity: 0, y: 30 }, // Começa invisível e 30px para baixo
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" } // Animação suave de 0.8s
  },
};

// Variante para a imagem
const imageVariants = {
  hidden: { opacity: 0, scale: 0.98 }, // Começa invisível e um pouco menor
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } // Curva de ease bem suave
  },
};

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        {/* O motion.div pai usa a variante 'container' para controlar os filhos */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Cada elemento filho usa a variante 'textVariants' */}
          <motion.h1 className={styles.heroTitle} variants={textVariants}>
            Peças artesanais que transformam momentos em memórias
          </motion.h1>

          <motion.p className={styles.heroDescription} variants={textVariants}>
            Cada ponto, um gesto de carinho. Cada peça, uma história única. Descubra a delicadeza do feito à mão e encante-se com coleções que celebram a beleza dos detalhes.
          </motion.p>

          <motion.div variants={textVariants}>
            <Link href="/catalogo" className={styles.ctaButton}>
              Conheça nossos produtos
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className={styles.heroImageContainer}>
        {/* A imagem usa sua própria variante para uma animação independente */}
        <motion.div initial="hidden" animate="visible" variants={imageVariants}>
          <Image
            src="/hero1.jpeg" // Certifique-se que esta imagem está na pasta /public
            alt="Mesa posta decorada com produtos artesanais do Ateliê Raisa"
            width={800}
            height={1000}
            className={styles.heroImage}
            priority // Otimiza o carregamento da imagem principal
          />
        </motion.div>
      </div>
    </section>
  );
}