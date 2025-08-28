// src/components/Header/Header.js (VERSÃO COMPLETA E FINAL)

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, User, Menu, X, LogOut, Settings } from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const { cartItems, toggleCart, isLoggedIn, logout, favorites, toggleWishlist } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Efeito para fechar o dropdown se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalFavorites = favorites.length;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className={styles.wrapper}>
        <div className={styles.topBar}>
          <p>BEM-VINDA AO NOSSO ATELIÊ — PEÇAS FEITAS À MÃO COM AMOR ✨</p>
        </div>
        <div className={styles.mainHeader}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <span className={styles.logoPrimary}>Ateliê</span>
              <span className={styles.logoSecondary}>Raisa</span>
            </Link>
          </div>
          <nav className={styles.desktopNavigation}>
            <ul className={styles.navList}>
              <li><Link href="/" className={styles.navLink}>Início</Link></li>
              <li><Link href="/catalogo" className={styles.navLink}>Catálogo</Link></li>
              <li><Link href="/sobre" className={styles.navLink}>Sobre</Link></li>
              <li><Link href="/contato" className={styles.navLink}>Contato</Link></li>
            </ul>
          </nav>
          <div className={styles.actions}>
            <button onClick={toggleWishlist} className={styles.iconButton} aria-label="Favoritos">
              <Heart size={20} />
              {isLoggedIn && totalFavorites > 0 && <span className={styles.cartBadge}>{totalFavorites}</span>}
            </button>
            <button onClick={toggleCart} className={styles.iconButton} aria-label="Carrinho">
              <ShoppingBag size={20} />
              {totalCartItems > 0 && <span className={styles.cartBadge}>{totalCartItems}</span>}
            </button>
            <div className={styles.userSection} ref={dropdownRef}>
              {isLoggedIn ? (
                <button onClick={() => setIsDropdownOpen(prev => !prev)} className={styles.iconButton} aria-label="Menu do Perfil">
                  <User size={20} />
                </button>
              ) : (
                <Link href="/login" className={styles.loginButton}>Login</Link>
              )}
              <AnimatePresence>
                {isLoggedIn && isDropdownOpen && (
                  <motion.div
                    className={styles.userDropdown}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Link href="/perfil" onClick={() => setIsDropdownOpen(false)}><Settings size={16} /> Meu Cantinho</Link>
                    <button onClick={logout}><LogOut size={16} /> Sair</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <button onClick={toggleMenu} className={styles.menuToggle} aria-label="Abrir menu"><Menu size={24} /></button>
        </div>
      </header>
      
      {/* Os Drawers são renderizados no layout global, não mais aqui */}
      
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={toggleMenu} />
            <motion.div className={styles.mobileMenu} initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className={styles.mobileMenuHeader}>
                <h3 className={styles.mobileMenuTitle}>Menu</h3>
                <button onClick={toggleMenu} className={styles.closeButton}><X size={24} /></button>
              </div>
              <nav>
                <ul className={styles.mobileNavList}>
                  <li><Link href="/" onClick={toggleMenu} className={styles.mobileNavLink}>Início</Link></li>
                  <li><Link href="/catalogo" onClick={toggleMenu} className={styles.mobileNavLink}>Catálogo</Link></li>
                  <li><Link href="/sobre" onClick={toggleMenu} className={styles.mobileNavLink}>Sobre</Link></li>
                  <li><Link href="/contato" onClick={toggleMenu} className={styles.mobileNavLink}>Contato</Link></li>
                </ul>
              </nav>
              {isLoggedIn && <button onClick={logout} className={styles.logoutButtonMobile}><LogOut size={16} /> Sair</button>}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}