// app/login/page.js (ATUALIZADO COM REDIRECIONAMENTO DE ADMIN)
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import apiClient from '../../services/api'; // Usamos o apiClient padrão
import styles from './auth.module.css';

export default function LoginPage() {
  const { login } = useCart();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        senha,
      });

      const { usuario, token } = response.data;
      
      // Chama o login do contexto para salvar os dados e o token
      login(usuario, token); 
      
      // --- LÓGICA DE REDIRECIONAMENTO ---
      // Verifica o tipo ('role') do usuário retornado pela API
      if (usuario.tipo === 'admin') {
        // Se for admin, redireciona para o dashboard
        router.push('/admin');
      } else {
        // Se for cliente, redireciona para o perfil normal
        router.push('/perfil'); 
      }

    } catch (err) {
      const errorMessage = err.response?.data?.erro || 'Ocorreu um erro. Tente novamente.';
      setError(errorMessage);
      setIsLoading(false); // Libera o botão em caso de erro
    }
    // Não precisa de finally aqui, pois o redirecionamento já muda a página
  };

  return (
    <main className={styles.main}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Bem-vinda de volta!</h1>
        <p className={styles.subtitle}>Acesse seu cantinho para ver seus pedidos e favoritos.</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              required 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className={styles.redirectText}>
          Não tem uma conta? <Link href="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </main>
  );
}