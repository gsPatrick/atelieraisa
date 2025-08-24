// src/components/OurProcess.js

'use client';

import { motion } from 'framer-motion';
import { Feather, SwatchBook, HandHeart, Gift } from 'lucide-react';
import styles from './OurProcess.module.css';

const processSteps = [
  {
    icon: <Feather size={32} />, // Removemos a classe daqui para aplicar no CSS
    title: 'Inspiração e Desenho',
    description: 'Tudo começa com um sonho, um traço delicado no papel. A beleza dos momentos simples floresce em designs únicos e cheios de afeto.',
  },
  {
    icon: <SwatchBook size={32} />,
    title: 'Seleção de Materiais',
    description: 'A alma da peça nasce na escolha dos tecidos. Linho puro, algodão macio e fios de luz são selecionados para garantir um toque inesquecível.',
  },
  {
    icon: <HandHeart size={32} />,
    title: 'Mãos que Criam',
    description: 'Nossas artesãs dedicam tempo e carinho a cada ponto. Uma dança de agulhas e linhas que transforma matéria em pura emoção.',
  },
  {
    icon: <Gift size={32} />,
    title: 'Um Presente para Você',
    description: 'Sua peça é embalada como uma joia, perfumada com carinho e enviada para criar novas memórias afetivas em seu lar.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

export default function OurProcess() {
  return (
    <section className={styles.section}>
      <motion.div 
        className={styles.titleWrapper}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className={styles.title}>Feito com a Alma</h2>
        <p className={styles.subtitle}>
          A jornada de cada peça, da inspiração ao seu lar.
        </p>
      </motion.div>

      <motion.div 
        className={styles.stepsContainer}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {processSteps.map((step, index) => (
          <motion.div key={index} className={styles.step} variants={stepVariants}>
            <div className={`${styles.iconWrapper} ${styles[`iconWrapper--${index + 1}`]}`}>
              {step.icon}
            </div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}