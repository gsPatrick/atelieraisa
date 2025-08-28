// src/context/CartContext.js (CORRIGIDO PARA SUPORTE A VARIAÇÕES)

'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const fetchFavorites = useCallback(async () => {
    if (!localStorage.getItem('atelieRaisaToken')) return;
    try {
      const response = await apiClient.get('/favoritos');
      setFavoriteProducts(response.data);
      setFavorites(response.data.map(fav => fav.id));
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      if (error.response?.status === 401) {
        logout();
      }
      setFavorites([]);
      setFavoriteProducts([]);
    }
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('atelieRaisaCart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Erro ao parsear carrinho do localStorage", e);
        localStorage.removeItem('atelieRaisaCart');
      }
    }
    
    const token = localStorage.getItem('atelieRaisaToken');
    if (token) {
      const storedUser = localStorage.getItem('atelieRaisaUser');
      if (storedUser) {
        try {
          setIsLoggedIn(true);
          setUser(JSON.parse(storedUser));
          fetchFavorites();
        } catch (e) {
          console.error("Erro ao parsear usuário do localStorage", e);
          logout();
        }
      } else {
        localStorage.removeItem('atelieRaisaToken');
      }
    }
  }, [fetchFavorites]);

  useEffect(() => {
    localStorage.setItem('atelieRaisaCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const login = (userData, token) => {
    localStorage.setItem('atelieRaisaToken', token);
    localStorage.setItem('atelieRaisaUser', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    fetchFavorites();
  };

  const logout = () => {
    localStorage.clear();
    setCartItems([]); // Garante que o carrinho seja limpo no estado
    setIsLoggedIn(false);
    setUser(null);
    setFavorites([]);
    setFavoriteProducts([]);
    window.location.href = '/';
  };

  // --- FUNÇÕES DO CARRINHO CORRIGIDAS ---

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // --- MUDANÇA 1: Identificar item existente pela combinação de ID do produto E ID da variação ---
      const existingItem = prevItems.find(item => 
        item.id === product.id && item.variacaoId === product.variacaoId
      );

      if (existingItem) {
        // Se já existe, atualiza a quantidade do item correto
        return prevItems.map(item =>
          (item.id === product.id && item.variacaoId === product.variacaoId) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      // Se não existe, adiciona o novo produto (com sua variação) ao carrinho
      return [...prevItems, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const buyNow = (product, quantity = 1) => {
    // A lógica de "Comprar Agora" é essencialmente a mesma de "Adicionar ao Carrinho",
    // mas sem abrir o drawer. O roteamento é feito no componente que chama a função.
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id && item.variacaoId === product.variacaoId
      );

      if (existingItem) {
        return prevItems.map(item =>
          (item.id === product.id && item.variacaoId === product.variacaoId) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    // A promise é resolvida para que o componente possa chamar router.push('/checkout')
    return Promise.resolve(); 
  };

  const removeFromCart = (productId, variacaoId) => {
    // --- MUDANÇA 2: Filtrar e remover o item pela combinação correta de IDs ---
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.id === productId && item.variacaoId === variacaoId)
    ));
  };

  const updateQuantity = (productId, variacaoId, newQuantity) => {
    // --- MUDANÇA 3: A mesma lógica de remoção se a quantidade for menor que 1 ---
    if (newQuantity < 1) {
      removeFromCart(productId, variacaoId);
      return;
    }
    // E a mesma lógica de identificação para atualizar a quantidade do item correto
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === productId && item.variacaoId === variacaoId) 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // --- FUNÇÕES DE FAVORITOS (sem alterações) ---

  const toggleWishlist = () => {
    if (!isWishlistOpen) {
      fetchFavorites();
    }
    setIsWishlistOpen(prev => !prev);
  };

  const addFavorite = async (productId) => {
    if (!isLoggedIn) {
      alert("Você precisa estar logado para adicionar aos favoritos.");
      return;
    }
    try {
      await apiClient.post('/favoritos', { produtoId: productId });
      await fetchFavorites();
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
    }
  };

  const removeFavorite = async (productId) => {
    if (!isLoggedIn) return;
    try {
      await apiClient.delete(`/favoritos/${productId}`);
      setFavorites(prev => prev.filter(id => id !== productId));
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };
  
  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    buyNow,
    removeFromCart,
    updateQuantity,
    toggleCart,
    clearCart,
    isLoggedIn,
    user,
    login,
    logout,
    favorites,
    favoriteProducts,
    isWishlistOpen,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}