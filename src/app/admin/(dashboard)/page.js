// app/admin/(dashboard)/page.js
'use client';

import { useEffect, useState } from 'react';
import apiClient from '../../../services/api';
import styles from './admin-page.module.css';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    apiClient.get('/dashboard/metricas')
      .then(res => setMetrics(res.data))
      .catch(err => console.error("Erro ao buscar métricas", err));
  }, []);

  if (!metrics) return <p>Carregando métricas...</p>;

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h4>Faturamento Hoje</h4>
          <p>R$ {metrics.faturamentoHoje.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className={styles.metricCard}>
          <h4>Vendas Hoje</h4>
          <p>{metrics.vendasHoje}</p>
        </div>
        <div className={styles.metricCard}>
          <h4>Total de Clientes</h4>
          <p>{metrics.clientesTotal}</p>
        </div>
        <div className={styles.metricCard}>
          <h4>Total de Produtos</h4>
          <p>{metrics.produtosTotal}</p>
        </div>
      </div>
    </div>
  );
}