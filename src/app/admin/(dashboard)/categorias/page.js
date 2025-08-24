// app/admin/(dashboard)/categorias/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '../../../../services/api';
import styles from '../admin-page.module.css';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    apiClient.get('/categorias')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Erro ao buscar categorias", err));
  };

  useEffect(fetchCategories, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await apiClient.delete(`/categorias/${id}`);
        fetchCategories();
      } catch (error) {
        alert('Erro ao excluir categoria. Verifique se não há produtos vinculados a ela.');
      }
    }
  };

  return (
    <div>
      <div className={styles.headerActions}>
        <h1 className={styles.pageTitle}>Categorias</h1>
        <Link href="/admin/categorias/nova" className={styles.primaryButton}>Nova Categoria</Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Slug</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.nome}</td>
              <td>{cat.slug}</td>
              <td>{cat.ativo ? 'Sim' : 'Não'}</td>
              <td className={styles.actions}>
                <Link href={`/admin/categorias/editar/${cat.id}`}>Editar</Link>
                <button onClick={() => handleDelete(cat.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}   