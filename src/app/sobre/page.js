// app/sobre/page.js (COM WRAPPER PARA O COMPONENTE DE ANIMAÇÃO)
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PageHeader from '../../components/PageHeader/PageHeader';
import AnimatedThread from '../../components/AnimatedThread/AnimatedThread';
import styles from './page.module.css';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="O Sonho Bordado em Realidade"
        subtitle="Nossa história é tecida com paixão, delicadeza e o desejo de criar memórias afetivas."
      />
      <main className={styles.main}>
        <div className={styles.storyContainer}>
          {/* --- MUDANÇA: Wrapper adicionado para controle via CSS --- */}
          <div className={styles.animatedThreadContainer}>
            <AnimatedThread />
          </div>

          <div className={styles.contentWrapper}>
            {/* --- Seção 1: A Fundadora --- */}
            <motion.section 
              className={`${styles.section} ${styles.founderSection}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <div className={styles.imageWrapper}>
                <Image src="/atelie-dona.jpeg" alt="Raisa, fundadora do ateliê" fill sizes="(max-width: 900px) 80vw, 40vw" className={styles.image} />
              </div>
              <div className={styles.textWrapper}>
                <h2 className={styles.sectionTitle}>Das Mãos de Raisa para o Mundo</h2>
                <p>O Ateliê Raisa nasceu de um amor antigo por linhas, agulhas e a magia de transformar tecidos em arte. Cada peça que você vê aqui começou como um rabisco em meu caderno, uma inspiração vinda de um jardim florido ou da luz suave da manhã. Meu sonho é que cada criação leve um pouco desse calor e carinho para o seu lar.</p>
              </div>
            </motion.section>

            {/* --- Seção 2: Nosso Manifesto --- */}
            <motion.section 
              className={`${styles.section} ${styles.manifestoSection}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <div className={styles.textWrapper}>
                <h2 className={styles.sectionTitle}>Nosso Manifesto</h2>
                <p>Acreditamos no poder do feito à mão. Em um mundo acelerado, celebramos a beleza da calma, do toque humano e da imperfeição que torna cada peça única.</p>
                <ul className={styles.valuesList}>
                  <li><span className={styles.valueTitle}>Feito com Alma:</span> Cada ponto carrega uma intenção.</li>
                  <li><span className={styles.valueTitle}>Beleza nos Detalhes:</span> A verdadeira elegância está no acabamento.</li>
                  <li><span className={styles.valueTitle}>Memórias Afetivas:</span> Criamos peças para serem palco de bons momentos.</li>
                </ul>
              </div>
              <div className={styles.imageWrapper}>
                <Image src="/bordado-atelie.jpeg" alt="Detalhe de um bordado delicado" fill sizes="(max-width: 900px) 80vw, 40vw" className={styles.image} />
              </div>
            </motion.section>
          </div>
        </div>

        {/* --- Seção 3: O Ateliê --- */}
        <motion.section 
          className={styles.atelierSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className={styles.sectionTitle}>Um Vislumbre do Nosso Cantinho</h2>
          <div className={styles.gallery}>
            <div className={styles.galleryImage}><Image src="/mesa.jpeg" alt="Mesa de trabalho" fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.image} /></div>
            <div className={styles.galleryImage}><Image src="/tecidos.jpeg" alt="Tecidos e linhas" fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.image} /></div>
            <div className={styles.galleryImage}><Image src="/linha.jpeg" alt="Peça sendo finalizada" fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.image} /></div>
          </div>
        </motion.section>
      </main>
    </>
  );
}