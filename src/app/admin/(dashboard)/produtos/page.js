// app/admin/(dashboard)/produtos/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '../../../../services/api';
import styles from '../admin-page.module.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    apiClient.get('/produtos?limit=100') // Pega todos para simplificar
      .then(res => setProducts(res.data.produtos))
      .catch(err => console.error("Erro ao buscar produtos", err));
  };

  useEffect(fetchProducts, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await apiClient.delete(`/produtos/${id}`);
        fetchProducts(); // Recarrega a lista
      } catch (error) {
        alert('Erro ao excluir produto.');
      }
    }
  };

  return (
    <div>
      <div className={styles.headerActions}>
        <h1 className={styles.pageTitle}>Produtos</h1>
        <Link href="/admin/produtos/novo" className={styles.primaryButton}>Novo Produto</Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.nome}</td>
              <td>{product.categoria?.nome || 'N/A'}</td>
              <td>{product.ativo ? 'Sim' : 'Não'}</td>
              <td className={styles.actions}>
                <Link href={`/admin/produtos/editar/${product.id}`}>Editar</Link>
                <button onClick={() => handleDelete(product.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}