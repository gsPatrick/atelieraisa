// app/admin/(dashboard)/cupons/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '../../../../services/api';
import styles from '../admin-page.module.css';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = () => {
    apiClient.get('/cupons')
      .then(res => setCoupons(res.data))
      .catch(err => console.error("Erro ao buscar cupons", err));
  };

  useEffect(fetchCoupons, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cupom?')) {
      try {
        await apiClient.delete(`/cupons/${id}`);
        fetchCoupons();
      } catch (error) {
        alert('Erro ao excluir cupom.');
      }
    }
  };

  return (
    <div>
      <div className={styles.headerActions}>
        <h1 className={styles.pageTitle}>Cupons de Desconto</h1>
        <Link href="/admin/cupons/novo" className={styles.primaryButton}>Novo Cupom</Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Validade</th>
            <th>Usos</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(coupon => (
            <tr key={coupon.id}>
              <td>{coupon.codigo}</td>
              <td>{coupon.tipo}</td>
              <td>{coupon.tipo === 'percentual' ? `${coupon.valor}%` : `R$ ${coupon.valor}`}</td>
              <td>{new Date(coupon.validade).toLocaleDateString()}</td>
              <td>{coupon.usoAtual} / {coupon.usoMaximo}</td>
              <td>{coupon.ativo ? 'Sim' : 'Não'}</td>
              <td className={styles.actions}>
                <Link href={`/admin/cupons/editar/${coupon.id}`}>Editar</Link>
                <button onClick={() => handleDelete(coupon.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}