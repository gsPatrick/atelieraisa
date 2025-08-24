// app/admin/(dashboard)/categorias/nova/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../../../services/api';
import styles from '../../admin-page.module.css';

export default function NewCategoryPage() {
  const [formData, setFormData] = useState({ 
    nome: '', 
    descricao: '', 
    ativo: true 
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    // 1. Cria um FormData para enviar dados de texto e arquivo.
    const formDataWithImage = new FormData();
    formDataWithImage.append('nome', formData.nome);
    formDataWithImage.append('descricao', formData.descricao);
    formDataWithImage.append('ativo', String(formData.ativo)); // Booleano convertido para string
    if (imageFile) {
      formDataWithImage.append('file', imageFile); // 'file' é o nome que o backend espera
    }

    try {
      // 2. Envia a requisição POST, sobrescrevendo o header para 'multipart/form-data'
      await apiClient.post('/categorias', formDataWithImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Categoria criada com sucesso!');
      router.push('/admin/categorias');
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao criar categoria.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Nova Categoria</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="nome">Nome da Categoria</label>
          <input 
            type="text" 
            name="nome" 
            id="nome" 
            value={formData.nome} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="descricao">Descrição</label>
          <textarea 
            name="descricao" 
            id="descricao" 
            value={formData.descricao} 
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="imagem">Imagem da Categoria</label>
          <input 
            type="file" 
            name="imagem" 
            id="imagem" 
            onChange={handleImageChange} 
            accept="image/png, image/jpeg, image/webp" 
          />
        </div>
        <div className={styles.inputGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              name="ativo" 
              checked={formData.ativo} 
              onChange={handleChange} 
              style={{ width: 'auto' }}
            /> 
            Ativo (visível na loja)
          </label>
        </div>
        <button type="submit" className={styles.primaryButton} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Criar Categoria'}
        </button>
      </form>
    </div>
  );
}