// src/components/ProductInfo/ProductInfo.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Accordion from '../Accordion/Accordion';
import { useCart } from '../../context/CartContext';
import styles from './ProductInfo.module.css';

export default function ProductInfo({ product }) {
  const { addToCart, buyNow } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  
  // --- MUDANÇA 1: Acessar a variação padrão diretamente ---
  // Não precisamos mais de um estado para a variação selecionada.
  const defaultVariation = product.variacoes?.[0] || null;

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAction = (action) => {
    // Se por algum motivo não houver variação, não faz nada.
    if (!defaultVariation) {
      alert("Produto indisponível no momento.");
      return;
    }

    const productForCart = {
      ...product,
      id: product.id,
      variacaoId: defaultVariation.id,
      name: product.nome, // Usamos apenas o nome do produto
      price: parseFloat(defaultVariation.preco),
      images: product.imagens,
    };
    
    action(productForCart, quantity);
  };
  
  const handleAddToCart = () => {
    handleAction(addToCart);
  };

  const handleBuyNow = async () => {
    await handleAction(buyNow);
    router.push('/checkout');
  };

  // --- MUDANÇA 2: Preço a ser exibido ---
  const displayPrice = defaultVariation ? parseFloat(defaultVariation.preco).toFixed(2).replace('.', ',') : '0,00';

  return (
    <div className={styles.info}>
      <p className={styles.category}>{product.categoria?.nome || 'Sem Categoria'}</p>
      <h1 className={styles.name}>{product.nome}</h1>
      
      {/* --- MUDANÇA 3: Seção de Variações REMOVIDA ---
          A lógica de seleção de botões não é mais necessária.
      */}

      <p className={styles.price}>R$ {displayPrice}</p>
      
      <div className={styles.actions}>
        <div className={styles.quantitySelector}>
          <button onClick={() => handleQuantityChange(-1)}><Minus size={16} /></button>
          <span>{quantity}</span>
          <button onClick={() => handleQuantityChange(1)}><Plus size={16} /></button>
        </div>
        <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={!defaultVariation}>
          <ShoppingBag size={18} />
          <span>Adicionar ao Carrinho</span>
        </button>
      </div>
      <button className={styles.buyNowButton} onClick={handleBuyNow} disabled={!defaultVariation}>
        <span>Comprar Agora</span>
        <ArrowRight size={18} />
      </button>

      <div className={styles.accordionGroup}>
        {product.descricao && (
          <Accordion title="Descrição" defaultOpen={true}>
            <p>{product.descricao}</p>
          </Accordion>
        )}
        {/* Adicione outras seções se necessário */}
      </div>
    </div>
  );
}