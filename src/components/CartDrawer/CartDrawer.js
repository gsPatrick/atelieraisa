// src/components/CartDrawer.js (COMPLETO E CORRIGIDO)
'use client';

import Image from 'next/image';
import Link from 'next/link'; // Importar Link
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import styles from './CartDrawer.module.css';

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
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemImage}>
                        <Image src={item.images[0]} alt={item.name} fill sizes="100px" style={{ objectFit: 'cover' }} />
                      </div>
                      <div className={styles.itemDetails}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</p>
                        <div className={styles.quantityControls}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className={styles.removeItemButton}>
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
                  {/* MUDANÇA: Transformar o botão em um Link */}
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