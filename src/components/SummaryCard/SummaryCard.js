// src/components/SummaryCard/SummaryCard.js
'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './SummaryCard.module.css';

const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

export default function SummaryCard({ shippingCost }) {
  const { cartItems } = useCart();

  // Calcula o subtotal dos itens no carrinho
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Calcula o total final
  const total = subtotal + (shippingCost || 0);

  return (
    <aside className={styles.summary}>
      <h3 className={styles.title}>Resumo do Pedido</h3>
      
      <div className={styles.itemList}>
        {cartItems.length > 0 ? (
          cartItems.map(item => (
            <div key={`${item.id}-${item.variacaoId}`} className={styles.item}>
              <div className={styles.itemImage}>
                {/* Acesso seguro à imagem com fallback */}
                <Image 
                  src={item.images?.[0] || PLACEHOLDER_IMAGE} 
                  alt={item.name} 
                  fill 
                  sizes="60px" 
                  style={{ objectFit: 'cover' }} 
                />
                <span className={styles.itemQuantity}>{item.quantity}</span>
              </div>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemPrice}>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            </div>
          ))
        ) : (
          <p className={styles.emptyCartText}>Seu carrinho está vazio.</p>
        )}
      </div>
      
      <div className={styles.costDetails}>
        <div className={styles.costRow}>
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={styles.costRow}>
          <span>Frete</span>
          <span>
            {/* Lógica aprimorada para exibir o status do frete */}
            {typeof shippingCost === 'number'
              ? `R$ ${shippingCost.toFixed(2).replace('.', ',')}`
              : 'A calcular'
            }
          </span>
        </div>
      </div>
      
      <div className={styles.totalRow}>
        <strong>Total</strong>
        <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
      </div>
    </aside>
  );
}