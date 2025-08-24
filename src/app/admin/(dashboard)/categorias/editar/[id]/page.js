// app/admin/(dashboard)/categorias/editar/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '../../../../../../services/api';
import Image from 'next/image';
import styles from '../../../admin-page.module.css';

export default function EditCategoryPage() {
  const [formData, setFormData] = useState({ nome: '', descricao: '', ativo: true });
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      apiClient.get(`/categorias/${id}`).then(res => {
        const cat = res.data;
        setFormData({
          nome: cat.nome,
          descricao: cat.descricao || '',
          ativo: cat.ativo,
        });
        setCurrentImageUrl(cat.imagemUrl);
        setIsLoading(false);
      }).catch(err => {
        console.error("Erro ao buscar categoria", err);
        alert("Categoria não encontrada.");
        router.push('/admin/categorias');
      });
    }
  }, [id, router]);

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

    const formDataWithImage = new FormData();
    formDataWithImage.append('nome', formData.nome);
    formDataWithImage.append('descricao', formData.descricao);
    formDataWithImage.append('ativo', String(formData.ativo));
    if (imageFile) {
      formDataWithImage.append('file', imageFile);
    }

    try {
      // Envia a requisição PUT, sobrescrevendo o header para 'multipart/form-data'
      await apiClient.put(`/categorias/${id}`, formDataWithImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Categoria atualizada com sucesso!');
      router.push('/admin/categorias');
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao atualizar categoria.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.nome) {
      return <p>Carregando categoria...</p>;
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Editar Categoria #{id}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="nome">Nome</label>
          <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="descricao">Descrição</label>
          <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} rows="4"></textarea>
        </div>
        <div className={styles.inputGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleChange} style={{ width: 'auto' }} /> Ativo
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="imagem">Imagem da Categoria</label>
          {currentImageUrl && !imageFile && (
            <div style={{ marginBottom: '1rem' }}>
              <Image src={currentImageUrl} alt="Imagem atual da categoria" width={100} height={100} style={{ objectFit: 'cover', borderRadius: '8px' }} />
            </div>
          )}
          <input type="file" name="imagem" id="imagem" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" />
          <small>Selecione uma nova imagem apenas se desejar substituir a atual.</small>
        </div>
        <button type="submit" className={styles.primaryButton} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Atualizar Categoria'}
        </button>
      </form>
    </div>
  );
}