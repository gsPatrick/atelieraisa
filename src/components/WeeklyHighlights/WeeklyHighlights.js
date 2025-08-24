// src/components/WeeklyHighlights/WeeklyHighlights.js (INTEGRADO COM API)

'use client';

import { useState, useEffect } from 'react'; // Hooks
import { motion } from 'framer-motion';
import Link from 'next/link';
import apiClient from '../../services/api'; // Nosso cliente Axios
import ProductCard from '../ProductCard/ProductCard';
import styles from './WeeklyHighlights.module.css';

// Importando Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function WeeklyHighlights() {
  const [highlightedProducts, setHighlightedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setIsLoading(true);
        // Busca os lançamentos da API, limitando a 8, por exemplo.
        const response = await apiClient.get('/produtos/lancamentos?limit=8');
        setHighlightedProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos em destaque:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  // Renderização condicional enquanto carrega
  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Nossos Queridinhos</h2>
          <p className={styles.subtitle}>Carregando peças selecionadas com carinho...</p>
        </div>
      </section>
    );
  }

  // Renderização condicional se não houver produtos
  if (highlightedProducts.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Nossos Queridinhos</h2>
          <p className={styles.subtitle}>
            Novidades encantadoras estão sendo preparadas e aparecerão aqui em breve!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <motion.div 
        className={styles.titleWrapper}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className={styles.title}>Nossos Queridinhos</h2>
        <p className={styles.subtitle}>
          Peças selecionadas com carinho, que encantam e contam histórias.
        </p>
      </motion.div>
      
      <div className={styles.carouselContainer}>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={highlightedProducts.length > 4} // Ativa o loop apenas se houver itens suficientes
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
          }}
        >
          {highlightedProducts.map((product) => (
            <SwiperSlide key={product.id}>
              {/* O ProductCard já está pronto para receber os dados da API */}
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.viewAllButtonWrapper}>
        <Link href="/catalogo" className={styles.viewAllButton}>
          Ver todos os produtos
        </Link>
      </div>
    </section>
  );
}