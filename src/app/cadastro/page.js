// app/cadastro/page.js (INTEGRADO COM API)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import axios from 'axios'; // NOVO: Para fazer requisições HTTP
import { API_URL } from '../../services/api'; // NOVO: Importando a URL da nossa API
import styles from '../login/auth.module.css';

export default function RegisterPage() {
  const { login } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '', // ALTERADO: nome do campo para corresponder ao backend
    email: '',
    senha: '', // ALTERADO: nome do campo para corresponder ao backend
    cep: '',
    rua: '', // ALTERADO: nome do campo para corresponder ao backend
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState(''); // NOVO: Estado para mensagens de erro

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // ALTERADO: Busca de CEP real via API
  useEffect(() => {
    if (formData.cep.replace(/\D/g, '').length === 8) {
      setCepLoading(true);
      setError('');
      axios.post(`${API_URL}/enderecos/validar-cep`, { cep: formData.cep })
        .then(response => {
          const { data } = response;
          setFormData(prev => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
          }));
        })
        .catch(err => {
          setError('CEP não encontrado ou inválido.');
          console.error('Erro ao buscar CEP:', err);
        })
        .finally(() => {
          setCepLoading(false);
        });
    }
  }, [formData.cep]);

  // ALTERADO: Submissão do formulário para a API real
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Registrar o usuário (nome, email, senha)
      const registerResponse = await axios.post(`${API_URL}/auth/register`, {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      });

      const { usuario, token } = registerResponse.data;

      // 2. Fazer o login no contexto com os dados recebidos
      login(usuario, token);

      // 3. Criar o primeiro endereço do usuário já autenticado
      await axios.post(`${API_URL}/enderecos`, {
        cep: formData.cep,
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        principal: true, // Define como endereço principal
        nome: 'Principal' // Apelido padrão
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 4. Redirecionar para a página de perfil
      router.push('/perfil');

    } catch (err) {
      const errorMessage = err.response?.data?.erro || 'Ocorreu um erro. Tente novamente.';
      setError(errorMessage);
      console.error('Erro no cadastro:', err);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Crie seu Cantinho</h1>
        <p className={styles.subtitle}>É rápido e fácil! Complete seus dados para agilizar suas compras.</p>
        <form onSubmit={handleSubmit}>
          {/* Dados Pessoais */}
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Seu nome</label>
            <input type="text" id="nome" value={formData.nome} onChange={handleInputChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="senha">Crie uma senha</label>
            <input type="password" id="senha" value={formData.senha} onChange={handleInputChange} required />
          </div>

          {/* Endereço */}
          <div className={styles.addressBlock}>
            <h2 className={styles.blockTitle}>Endereço de Entrega Principal</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="cep">CEP</label>
              <input type="text" id="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000" required />
              {cepLoading && <small className={styles.loadingText}>Buscando endereço...</small>}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="rua">Endereço</label>
              <input type="text" id="rua" value={formData.rua} onChange={handleInputChange} readOnly={cepLoading} required />
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="numero">Número</label>
                <input type="text" id="numero" value={formData.numero} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="complemento">Complemento</label>
                <input type="text" id="complemento" value={formData.complemento} onChange={handleInputChange} />
              </div>
            </div>
             <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                    <label htmlFor="bairro">Bairro</label>
                    <input type="text" id="bairro" value={formData.bairro} onChange={handleInputChange} readOnly={cepLoading} required />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="cidade">Cidade</label>
                    <input type="text" id="cidade" value={formData.cidade} onChange={handleInputChange} readOnly={cepLoading} required />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="estado">Estado</label>
                    <input type="text" id="estado" value={formData.estado} onChange={handleInputChange} readOnly={cepLoading} required />
                </div>
            </div>
          </div>
          
          {error && <p className={styles.errorText}>{error}</p>} {/* Exibe a mensagem de erro */}
          
          <button type="submit" className={styles.submitButton}>Criar Conta</button>
        </form>
        <p className={styles.redirectText}>
          Já tem uma conta? <Link href="/login">Faça login</Link>
        </p>
      </div>
    </main>
  );
}