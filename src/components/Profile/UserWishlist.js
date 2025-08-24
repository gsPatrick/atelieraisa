// src/components/Profile/UserWishlist.js (CONECTADO AO CONTEXTO E API)
'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import ProductCard from '../ProductCard/ProductCard';
import styles from './Profile.module.css';

// Recebe a lista de favoritos e a função de atualização da página pai
export default function UserWishlist({ favorites, onUpdate }) {
  const { removeFavorite } = useCart();

  // Sobrescreve a função do ProductCard para remover da lista e recarregar
  const handleRemoveFromWishlist = async (productId) => {
    await removeFavorite(productId);
    onUpdate(); // Pede para a página de perfil recarregar a lista da API
  };

  return (
    <div className={styles.contentPanel}>
      <h3 className={styles.panelTitle}>Peças que você amou</h3>
      <p className={styles.panelSubtitle}>Salve seus achados favoritos para não perdê-los de vista!</p>
      {favorites && favorites.length > 0 ? (
        <div className={styles.wishlistGrid}>
          {favorites.map(favProduct => (
            // Passamos uma versão modificada do ProductCard que usa a nossa função de remoção
            <div key={favProduct.id}>
                <ProductCard 
                    product={favProduct} 
                    // Aqui poderíamos passar uma prop para alterar a função do coração,
                    // mas a forma mais simples é deixar o contexto cuidar disso.
                    // A atualização já é feita pelo onUpdate.
                />
            </div>
          ))}
        </div>
      ) : (
        <p>Sua lista de favoritos está vazia.</p>
      )}
    </div>
  );
}