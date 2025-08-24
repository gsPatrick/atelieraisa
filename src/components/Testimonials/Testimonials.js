// src/components/Testimonials.js

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Testimonials.module.css';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules'; // Adicionamos EffectFade
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // Importamos o estilo do efeito

const testimonialsData = [
  {
    quote: "Receber minha encomenda foi como abrir um presente. O cuidado em cada detalhe, o perfume suave... tudo impecável. A peça é ainda mais linda ao vivo!",
    highlight: "Como abrir um presente",
    author: "Juliana M.",
    location: "Belo Horizonte, MG",
    image: "/dois.jpg"
  },
  {
    quote: "Qualidade excepcional! O linho é maravilhoso e o bordado é de uma delicadeza que emociona. Transformou completamente minha mesa de jantar. Com certeza comprarei novamente.",
    highlight: "Delicadeza que emociona",
    author: "Carla S.",
    location: "São Paulo, SP",
    image: "/tres.jpg"
  },
  {
    quote: "Comprei para presentear minha mãe e foi o maior sucesso. A embalagem já é uma experiência à parte. É nítido o amor que a Raisa coloca em cada criação. Obrigada!",
    highlight: "O amor em cada criação",
    author: "Fernanda L.",
    location: "Rio de Janeiro, RJ",
    image: "/um.jpeg"
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <motion.div 
        className={styles.titleWrapper}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className={styles.title}>Histórias que nos Inspiram</h2>
        <p className={styles.subtitle}>
          O carinho de quem recebe nossas peças em casa.
        </p>
      </motion.div>

      <motion.div 
        className={styles.carouselContainer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.0, delay: 0.3 }}
      >
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={30}
        >
          {testimonialsData.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className={styles.testimonialCard}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src={testimonial.image} 
                    alt={`Depoimento de ${testimonial.author}`} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.contentWrapper}>
                  <span className={styles.highlightText}>{testimonial.highlight}</span>
                  <p className={styles.quoteText}>{testimonial.quote}</p>
                  <div className={styles.decorativeLine}></div>
                  <div className={styles.authorInfo}>
                    <p className={styles.authorName}>{testimonial.author}</p>
                    <p className={styles.authorLocation}>{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}