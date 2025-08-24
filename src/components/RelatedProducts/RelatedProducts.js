// src/components/RelatedProducts/RelatedProducts.js (INTEGRADO COM API)

'use client';

import ProductCard from '../ProductCard/ProductCard';
import styles from './RelatedProducts.module.css';

// Importando componentes e estilos do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// O componente agora recebe a lista de produtos diretamente
export default function RelatedProducts({ relatedProducts }) {

  // Se não houver produtos relacionados, não renderiza nada
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Combine com</h2>
      <div className={styles.carouselContainer}>
        <Swiper
          modules={[Navigation]}
          navigation={true}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {relatedProducts.map(product => (
            <SwiperSlide key={product.id}>
              {/* O ProductCard já está pronto para receber os dados */}
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}