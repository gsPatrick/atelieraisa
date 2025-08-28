// src/components/WishlistDrawer.js (REDESENHADO SEM IMAGENS)
'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Eye } from 'lucide-react';
import styles from './WishlistDrawer.module.css';

export default function WishlistDrawer() {
  const { isWishlistOpen, toggleWishlist, favoriteProducts, removeFavorite } = useCart();

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleWishlist}
          />
          <motion.div
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>Meus Favoritos</h3>
              <button onClick={toggleWishlist} className={styles.closeButton}><X size={24} /></button>
            </div>
            {favoriteProducts.length === 0 ? (
              <div className={styles.empty}>
                <p>Sua lista de favoritos está vazia.</p>
                <Link href="/catalogo" onClick={toggleWishlist} className={styles.continueShopping}>
                  Encontrar peças
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.itemList}>
                  {favoriteProducts.map(item => {
                    const displayPrice = item.variacoes?.[0]?.preco || '0.00';

                    // --- MUDANÇA 1: A estrutura do item foi completamente simplificada ---
                    return (
                      <div key={item.id} className={styles.item}>
                        <div className={styles.itemDetails}>
                          <p className={styles.itemName}>{item.nome}</p>
                          <p className={styles.itemPrice}>R$ {parseFloat(displayPrice).toFixed(2).replace('.', ',')}</p>
                          <Link href={`/catalogo/${item.slug}`} onClick={toggleWishlist} className={styles.viewProductButton}>
                            <Eye size={14} /> Ver Produto
                          </Link>
                        </div>
                        <button onClick={() => removeFavorite(item.id)} className={styles.removeItemButton}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.footer}>
                  <Link href="/perfil" onClick={toggleWishlist} className={styles.viewAllButton}>
                    Ver todos os favoritos no meu perfil
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}