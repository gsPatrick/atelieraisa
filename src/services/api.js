// services/api.js

import axios from 'axios';

// 1. CORRIGINDO A PORTA para 3045, que é a porta onde seu backend está rodando.
export const API_URL ='https://geral-ateliatania-api.r954jc.easypanel.host/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Requisição (Versão Final e Correta)
 * 
 * Esta função é executada ANTES de cada requisição ser enviada.
 */
apiClient.interceptors.request.use(
  (config) => {
    // 2. USANDO O NOME CORRETO DO TOKEN que está no seu CartContext.
    const token = localStorage.getItem('atelieRaisaToken');

    // Adiciona o cabeçalho 'Authorization' APENAS SE o token for encontrado.
    // Isso garante que a página de login (onde não há token) não envie
    // o cabeçalho, evitando o erro de preflight/CORS.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;