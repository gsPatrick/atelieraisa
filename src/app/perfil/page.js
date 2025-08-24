// app/perfil/page.js (INTEGRADO COM API)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Package, Heart, LogOut } from 'lucide-react'; // Ícone de endereço adicionado
import { useCart } from '@/context/CartContext';
import apiClient from '../../services/api'; // Importando nosso cliente Axios configurado

import PageHeader from '../../components/PageHeader/PageHeader';
import UserDetails from '../../components/Profile/UserDetails'; // Novo componente
import UserAddresses from '../../components/Profile/UserAddresses'; // Novo componente
import UserOrders from '../../components/Profile/UserOrders'; // Novo componente
import UserWishlist from '../../components/Profile/UserWishlist'; // Novo componente
import styles from './page.module.css';

// Navegação atualizada com a aba "Endereços"
const navItems = [
  { key: 'details', label: 'Meus Dados', icon: <User size={18} /> },
  { key: 'addresses', label: 'Endereços', icon: <MapPin size={18} /> },
  { key: 'orders', label: 'Meus Pedidos', icon: <Package size={18} /> },
  { key: 'wishlist', label: 'Meus Favoritos', icon: <Heart size={18} /> },
  { key: 'logout', label: 'Sair', icon: <LogOut size={18} /> },
];

export default function ProfilePage() {
  const { user, isLoggedIn, logout } = useCart();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(true);

  // Estados para armazenar os dados vindos da API
  const [profileData, setProfileData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Efeito para proteger a rota e buscar os dados
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Busca todos os dados em paralelo para otimizar o carregamento
        const [profileRes, addressesRes, ordersRes, favoritesRes] = await Promise.all([
          apiClient.get('/usuarios/perfil'),
          apiClient.get('/enderecos'),
          apiClient.get('/pedidos/meus-pedidos'),
          apiClient.get('/favoritos')
        ]);

        setProfileData(profileRes.data);
        setAddresses(addressesRes.data);
        setOrders(ordersRes.data.pedidos);
        setFavorites(favoritesRes.data);

      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
        // Se o token for inválido (erro 401), desloga o usuário
        if (error.response?.status === 401) {
          logout();
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, router, logout]);

  const handleTabChange = (tab) => {
    if (tab === 'logout') {
      logout();
      router.push('/');
    } else {
      setActiveTab(tab);
    }
  };
  
  // Função para ser passada como prop para o componente de endereços,
  // permitindo que ele peça para a página pai recarregar a lista.
  const refreshAddresses = async () => {
      const addressesRes = await apiClient.get('/enderecos');
      setAddresses(addressesRes.data);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className={styles.loading}>Carregando seus dados...</div>;
    }

    switch (activeTab) {
      case 'details':
        return <UserDetails initialData={profileData} />;
      case 'addresses':
        return <UserAddresses initialAddresses={addresses} onUpdate={refreshAddresses} />;
      case 'orders':
        return <UserOrders orders={orders} />;
      case 'wishlist':
        return <UserWishlist favorites={favorites} />;
      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader title="Meu Cantinho" subtitle="Um espaço para acompanhar seus pedidos, favoritos e mimos." />
      <main className={styles.main}>
        <div className={styles.profileLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.welcomeBox}>
              <div className={styles.avatar}>{user?.nome?.charAt(0)}</div>
              <p>Olá, {user?.nome?.split(' ')[0]}!</p>
            </div>
            <nav>
              <ul>
                {navItems.map(item => (
                  <li key={item.key}>
                    <button
                      className={`${styles.navButton} ${activeTab === item.key ? styles.active : ''}`}
                      onClick={() => handleTabChange(item.key)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className={styles.content}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}