// src/components/ProductCard/ProductCard.js (CORRIGIDO PARA LIDAR COM VARIAÇÕES)

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react'; // ShoppingBag não é mais necessário aqui
import { useCart } from '../../context/CartContext';
import styles from './ProductCard.module.css';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  },
};

export default function ProductCard({ product }) {
  const { addFavorite, removeFavorite, isFavorite } = useCart();
  
  const { id, nome, categoria, variacoes, imagens, slug, isExclusive } = product;

  // --- MUDANÇA 1: Lógica de preço aprimorada para variações ---
  let displayPrice = 'Consulte';
  if (variacoes && variacoes.length > 0) {
    if (variacoes.length === 1) {
      // Se só tem uma variação, mostra o preço dela
      displayPrice = `R$ ${parseFloat(variacoes[0].preco).toFixed(2).replace('.', ',')}`;
    } else {
      // Se tem várias, encontra o menor preço
      const prices = variacoes.map(v => parseFloat(v.preco));
      const minPrice = Math.min(...prices);
      displayPrice = `A partir de R$ ${minPrice.toFixed(2).replace('.', ',')}`;
    }
  }

  const displayImage = imagens?.[0] || '/images/placeholder.jpg';
  const isProdFavorite = isFavorite(id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (isProdFavorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <motion.div className={styles.cardWrapper} variants={cardVariants}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Link href={`/catalogo/${slug}`}>
            {isExclusive && <div className={styles.badge}>Exclusivo</div>}
            <Image
              src={displayImage}
              alt={nome}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.image}
            />
          </Link>
          <button 
            className={`${styles.favoriteButton} ${isProdFavorite ? styles.isFavorite : ''}`} 
            aria-label="Adicionar aos Favoritos"
            onClick={handleFavoriteClick}
          >
            <Heart size={18} fill={isProdFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className={styles.info}>
          <p className={styles.category}>{categoria?.nome || 'Categoria'}</p>
          <Link href={`/catalogo/${slug}`} className={styles.nameLink}>
            <h3 className={styles.name}>{nome}</h3>
          </Link>
          <p className={styles.price}>{displayPrice}</p>
        </div>

        {/* --- MUDANÇA 2: Substituir os botões de ação por um único link --- */}
        <div className={styles.actions}>
          <Link href={`/catalogo/${slug}`} className={styles.detailsButton}>
            <span>Ver Detalhes</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}