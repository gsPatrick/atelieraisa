// src/components/FeaturedCollections/FeaturedCollections.js (LINK CORRIGIDO)

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../services/api';
import CollectionCard from '../CollectionCard/CollectionCard';
import styles from './FeaturedCollections.module.css';

// Importando componentes e estilos do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Imagens padrão para fallback, caso a categoria não tenha uma imagem definida
const fallbackImages = [
  '/images/collection-mesa-posta.jpg',
  '/images/collection-bordados.jpg',
  '/images/collection-exclusivas.jpg',
];

export default function FeaturedCollections() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/categorias?ativo=true');
        
        const formattedCollections = response.data.map((cat, index) => ({
          id: cat.id,
          title: cat.nome,
          image: cat.imagemUrl || fallbackImages[index % fallbackImages.length],
          // --- MUDANÇA EXECUTADA AQUI ---
          // O link agora aponta para a rota correta: /catalogo
          href: `/catalogo?categoria=${cat.slug}`,
        }));
        setCollections(formattedCollections);
      } catch (error) {
        console.error("Erro ao buscar coleções (categorias):", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Nossas Coleções</h2>
          <p className={styles.subtitle}>Carregando nossas criações...</p>
        </div>
      </section>
    );
  }
  
  if (collections.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Nossas Coleções</h2>
          <p className={styles.subtitle}>
            Nossas coleções especiais aparecerão aqui em breve. Fique de olho!
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className={styles.section}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>Nossas Coleções</h2>
        <p className={styles.subtitle}>
          Explore nossos universos de criação, pensados para encantar e inspirar.
        </p>
      </div>
      
      <div className={styles.carouselContainer}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={collections.length > 3}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="collectionsCarousel"
        >
          {collections.map((collection) => (
            <SwiperSlide key={collection.id}>
              <CollectionCard
                title={collection.title}
                image={collection.image}
                href={collection.href}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.section>
  );
}