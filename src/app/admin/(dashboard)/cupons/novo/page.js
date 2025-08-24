// app/admin/(dashboard)/cupons/novo/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../../../services/api';
import styles from '../../admin-page.module.css';

export default function NewCouponPage() {
  const [formData, setFormData] = useState({
    codigo: '', valor: '', tipo: 'percentual', validade: '', usoMaximo: 1, ativo: true
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/cupons', formData);
      router.push('/admin/cupons');
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao criar cupom.');
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Novo Cupom</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="codigo">Código</label>
          <input type="text" name="codigo" id="codigo" value={formData.codigo} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="valor">Valor</label>
          <input type="number" name="valor" id="valor" value={formData.valor} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="tipo">Tipo</label>
          <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="percentual">Percentual (%)</option>
            <option value="fixo">Fixo (R$)</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="validade">Data de Validade</label>
          <input type="date" name="validade" id="validade" value={formData.validade} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="usoMaximo">Uso Máximo</label>
          <input type="number" name="usoMaximo" id="usoMaximo" value={formData.usoMaximo} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label><input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleChange} /> Ativo</label>
        </div>
        <button type="submit" className={styles.primaryButton}>Salvar</button>
      </form>
    </div>
  );
}