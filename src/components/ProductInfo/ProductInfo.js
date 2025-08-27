// src/components/ProductInfo/ProductInfo.js (REATORADO PARA LAYOUT DE SELEÇÃO)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Accordion from '../Accordion/Accordion';
import { useCart } from '../../context/CartContext';
import styles from './ProductInfo.module.css';

export default function ProductInfo({ product }) {
  const { addToCart, buyNow } = useCart();
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    // Define a primeira variação como padrão ao carregar
    if (product.variacoes && product.variacoes.length > 0) {
      setSelectedVariation(product.variacoes[0]);
    } else {
      setSelectedVariation(null);
    }
  }, [product]);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAction = (action) => {
    if (!selectedVariation) {
      alert("Por favor, selecione uma opção para continuar.");
      return;
    }

    const productForCart = {
      ...product,
      id: product.id,
      variacaoId: selectedVariation.id,
      name: `${product.nome} (${selectedVariation.nome})`,
      price: parseFloat(selectedVariation.preco),
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

  // Preço dinâmico baseado na variação
  const displayPrice = selectedVariation 
    ? parseFloat(selectedVariation.preco).toFixed(2).replace('.', ',') 
    : '0,00';
    
  return (
    <div className={styles.info}>
      <p className={styles.category}>{product.categoria?.nome || 'Sem Categoria'}</p>
      <h1 className={styles.name}>{product.nome}</h1>
      
      {/* --- MUDANÇA 1: Condição corrigida para >= 1 --- */}
      {/* Renderiza as opções sempre que houver pelo menos UMA variação */}
      {product.variacoes && product.variacoes.length >= 1 && (
        <div className={styles.variations}>
          <label className={styles.variationLabel}>Variações:</label>
          <div className={styles.variationList}>
            {product.variacoes.map((variation) => (
              // --- MUDANÇA 2: Estrutura alterada para se assemelhar a um input radio ---
              <div 
                key={variation.id}
                onClick={() => setSelectedVariation(variation)}
                className={`${styles.variationCard} ${selectedVariation?.id === variation.id ? styles.selected : ''}`}
              >
                <div className={styles.radioCircle}></div>
                <div className={styles.variationDetails}>
                  <span className={styles.variationName}>{variation.nome}</span>
                  {variation.estoque !== null && <span className={styles.variationStock}>{variation.estoque} em estoque</span>}
                </div>
                <span className={styles.variationPrice}>R$ {parseFloat(variation.preco).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Se não houver variações, exibe o preço principal do produto (se houver) */}
      {(!product.variacoes || product.variacoes.length === 0) && (
          <p className={styles.price}>R$ {displayPrice}</p>
      )}
      
      <div className={styles.actions}>
        <div className={styles.quantitySelector}>
          <button onClick={() => handleQuantityChange(-1)}><Minus size={16} /></button>
          <span>{quantity}</span>
          <button onClick={() => handleQuantityChange(1)}><Plus size={16} /></button>
        </div>
        <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={!selectedVariation}>
          <ShoppingBag size={18} />
          <span>Adicionar ao Carrinho</span>
        </button>
      </div>
      <button className={styles.buyNowButton} onClick={handleBuyNow} disabled={!selectedVariation}>
        <span>Comprar Agora</span>
        <ArrowRight size={18} />
      </button>

      <div className={styles.accordionGroup}>
        {product.descricao && (
          <Accordion title="Descrição" defaultOpen={true}>
            <p>{product.descricao}</p>
          </Accordion>
        )}
      </div>
    </div>
  );
}