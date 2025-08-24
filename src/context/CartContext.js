// src/context/CartContext.js (VERSÃO COMPLETA E FINAL)

'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api'; // Importando nosso cliente Axios configurado

// 1. Criação do Contexto
const CartContext = createContext();

// 2. Hook customizado para facilitar o uso
export function useCart() {
  return useContext(CartContext);
}

// 3. Componente Provedor
export function CartProvider({ children }) {
  // --- ESTADOS ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]); // Estado para IDs dos favoritos
  const [isWishlistOpen, setIsWishlistOpen] = useState(false); // Estado para o drawer de favoritos
  const [favoriteProducts, setFavoriteProducts] = useState([]); // Armazena os objetos completos dos produtos favoritos

  // --- FUNÇÕES DE DADOS (API CALLS) ---

  // useCallback para evitar recriação da função em cada renderização
  const fetchFavorites = useCallback(async () => {
    // Apenas busca se o usuário estiver logado
    if (!localStorage.getItem('atelieRaisaToken')) return;
    
    try {
      const response = await apiClient.get('/favoritos');
      // Armazena os produtos completos para o drawer
      setFavoriteProducts(response.data);
      // Armazena apenas os IDs para verificações rápidas (isFavorite)
      setFavorites(response.data.map(fav => fav.id));
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      // Limpa os favoritos se houver um erro (ex: token inválido)
      if (error.response?.status === 401) {
        logout(); // Desloga o usuário se o token for inválido
      }
      setFavorites([]);
      setFavoriteProducts([]);
    }
  }, []); // A função logout não precisa ser dependência aqui

  // --- EFEITOS (LIFECYCLE) ---

  // Efeito para carregar dados do localStorage na inicialização do app
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

  // Efeito para salvar o carrinho no localStorage sempre que ele for alterado
  useEffect(() => {
    localStorage.setItem('atelieRaisaCart', JSON.stringify(cartItems));
  }, [cartItems]);


  // --- FUNÇÕES DE AUTENTICAÇÃO ---

  const login = (userData, token) => {
    localStorage.setItem('atelieRaisaToken', token);
    localStorage.setItem('atelieRaisaUser', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    fetchFavorites();
  };

  const logout = () => {
    localStorage.clear(); // Limpa todo o localStorage para garantir um estado limpo
    setIsLoggedIn(false);
    setUser(null);
    setFavorites([]);
    setFavoriteProducts([]);
    window.location.href = '/'; // Redireciona para a home
  };

  // --- FUNÇÕES DO CARRINHO ---

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id && item.variacaoId === product.variacaoId);
      if (existingItem) {
        return prevItems.map(item =>
          (item.id === product.id && item.variacaoId === product.variacaoId) ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const buyNow = (product, quantity = 1) => {
    return new Promise((resolve) => {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id && item.variacaoId === product.variacaoId);
        if (existingItem) {
          return prevItems.map(item =>
            (item.id === product.id && item.variacaoId === product.variacaoId) ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
      resolve();
    });
  };

  const removeFromCart = (productId, variacaoId) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === productId && item.variacaoId === variacaoId)));
  };

  const updateQuantity = (productId, variacaoId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, variacaoId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === productId && item.variacaoId === variacaoId) ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // --- FUNÇÕES DE FAVORITOS ---

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
      await fetchFavorites(); // Recarrega a lista completa para manter a consistência
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
    }
  };

  const removeFavorite = async (productId) => {
    if (!isLoggedIn) return;
    try {
      await apiClient.delete(`/favoritos/${productId}`);
      // Atualiza ambos os estados localmente para uma resposta de UI imediata
      setFavorites(prev => prev.filter(id => id !== productId));
      setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };
  
  // --- VALOR DO CONTEXTO ---
  const value = {
    // Carrinho
    cartItems,
    isCartOpen,
    addToCart,
    buyNow,
    removeFromCart,
    updateQuantity,
    toggleCart,
    clearCart,
    // Autenticação
    isLoggedIn,
    user,
    login,
    logout,
    // Favoritos
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