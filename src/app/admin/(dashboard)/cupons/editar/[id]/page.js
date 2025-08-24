
// app/admin/(dashboard)/cupons/editar/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '../../../../../../services/api';
import styles from '../../../admin-page.module.css';

export default function EditCouponPage() {
  const [formData, setFormData] = useState({
    codigo: '', valor: '', tipo: 'percentual', validade: '', usoMaximo: 1, ativo: true
  });
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      apiClient.get(`/cupons/${id}`).then(res => {
        const coupon = res.data;
        setFormData({
          codigo: coupon.codigo,
          valor: coupon.valor,
          tipo: coupon.tipo,
          // Formata a data para o input type="date"
          validade: new Date(coupon.validade).toISOString().split('T')[0],
          usoMaximo: coupon.usoMaximo,
          ativo: coupon.ativo,
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/cupons/${id}`, formData);
      router.push('/admin/cupons');
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao atualizar cupom.');
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Editar Cupom #{id}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
         {/* Formulário idêntico ao de criação */}
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
        <button type="submit" className={styles.primaryButton}>Atualizar</button>
      </form>
    </div>
  );
}