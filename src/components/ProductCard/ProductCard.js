// src/components/ProductCard/ProductCard.js

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, ArrowRight } from 'lucide-react';
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
  const { addToCart, buyNow, addFavorite, removeFavorite, isFavorite } = useCart();
  const router = useRouter();
  
  const { id, nome, categoria, variacoes, imagens, slug, isExclusive } = product;

  // --- MUDANÇA 1: Acessar a variação padrão e seu preço ---
  // Pega a primeira variação. Se não existir, cria um objeto fallback para evitar erros.
  const defaultVariation = variacoes?.[0] || { id: null, nome: '', preco: '0.00' };
  const displayPrice = parseFloat(defaultVariation.preco).toFixed(2).replace('.', ',');

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

  const handleAction = (action) => {
    // --- MUDANÇA 2: Criar o payload do produto para o carrinho ---
    // A lógica é a mesma para 'addToCart' e 'buyNow'.
    // Usamos a 'defaultVariation' que já pegamos acima.
    const productForCart = {
      ...product, // Espalha as propriedades do produto (slug, etc.)
      id: product.id,
      variacaoId: defaultVariation.id,
      name: nome, // Como só tem uma variação, usamos apenas o nome principal do produto.
      price: parseFloat(defaultVariation.preco),
      images: imagens,
    };
    
    action(productForCart, 1);
  };

  const handleBuyNowClick = async (e) => {
    e.preventDefault();
    await handleAction(buyNow);
    router.push('/checkout');
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    handleAction(addToCart);
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
          {/* --- MUDANÇA 3: Exibir o preço da variação --- */}
          <p className={styles.price}>R$ {displayPrice}</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.addToCartButton} onClick={handleAddToCartClick}>
            <ShoppingBag size={16} />
            <span>Adicionar</span>
          </button>
          <button className={styles.buyNowButton} onClick={handleBuyNowClick}>
            <span>Comprar Agora</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}