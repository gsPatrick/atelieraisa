// app/admin/(dashboard)/layout.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import AdminSidebar from '@/components/Admin/AdminSidebar'; // Criaremos este componente
import styles from './admin.module.css'; // Criaremos este CSS

export default function AdminLayout({ children }) {
  const { isLoggedIn, user } = useCart();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verifica se o usuário é um admin
    if (isLoggedIn && user?.tipo === 'admin') {
      setIsAuthorized(true);
    } else {
      // Se não for, redireciona para a home após um pequeno delay
      // para garantir que o estado do contexto foi carregado.
      setTimeout(() => {
        if (!isLoggedIn || user?.tipo !== 'admin') {
            router.push('/');
        }
      }, 100);
    }
  }, [isLoggedIn, user, router]);

  // Enquanto verifica, mostra uma tela de carregamento para evitar piscar o conteúdo
  if (!isAuthorized) {
    return <div className={styles.loadingScreen}>Verificando autorização...</div>;
  }

  // Se autorizado, mostra o layout do admin
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.adminContent}>
        {children}
      </main>
    </div>
  );
}