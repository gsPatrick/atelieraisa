// src/components/CartDrawer.js (CORRIGIDO PARA VARIAÇÕES)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import styles from './CartDrawer.module.css';

const PLACEHOLDER_IMAGE = '/images/placeholder.jpg'; // Imagem de fallback

export default function CartDrawer() {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />
          <motion.div
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>Meu Carrinho</h3>
              <button onClick={toggleCart} className={styles.closeButton}><X size={24} /></button>
            </div>
            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <p>Seu carrinho está vazio.</p>
                <Link href="/catalogo" onClick={toggleCart} className={styles.continueShopping}>
                  Continuar comprando
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.itemList}>
                  {cartItems.map(item => (
                    // --- MUDANÇA 1: A chave do item agora deve ser única para cada variação ---
                    <div key={`${item.id}-${item.variacaoId}`} className={styles.item}>
                      <div className={styles.itemImage}>
                        {/* Acesso seguro à imagem com fallback */}
                        <Image src={item.images?.[0] || PLACEHOLDER_IMAGE} alt={item.name} fill sizes="100px" style={{ objectFit: 'cover' }} />
                      </div>
                      <div className={styles.itemDetails}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</p>
                        <div className={styles.quantityControls}>
                          {/* --- MUDANÇA 2: Passar 'item.variacaoId' para a função updateQuantity --- */}
                          <button onClick={() => updateQuantity(item.id, item.variacaoId, item.quantity - 1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.variacaoId, item.quantity + 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                      {/* --- MUDANÇA 3: Passar 'item.variacaoId' para a função removeFromCart --- */}
                      <button onClick={() => removeFromCart(item.id, item.variacaoId)} className={styles.removeItemButton}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.footer}>
                  <div className={styles.subtotal}>
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <Link href="/checkout" onClick={toggleCart} className={styles.checkoutButton}>
                    Finalizar Compra
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