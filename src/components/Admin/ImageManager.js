// components/Admin/ImageManager.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Star } from 'lucide-react';
import apiClient from '../../services/api'; // Importa o cliente padrão
import styles from './Admin.module.css';

export default function ImageManager({ productId, initialImages = [], onUpdate }) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    try {
      // --- MUDANÇA CRUCIAL AQUI ---
      // Usamos o apiClient padrão, mas passamos a configuração de header
      // para indicar que estamos enviando um formulário com arquivos.
      await apiClient.post(`/uploads/produtos/${productId}/imagens`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Imagens enviadas com sucesso!');
      onUpdate(); // Recarrega os dados na página pai
    } catch (error) {
      alert('Erro ao fazer upload das imagens.');
      console.error(error);
    } finally {
      setUploading(false);
      e.target.value = null; 
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      try {
        // Rota de deleção não precisa de header especial
        await apiClient.delete(`/uploads/arquivos/${imageId}`);
        alert('Imagem excluída com sucesso!');
        onUpdate();
      } catch (error) {
        alert('Erro ao excluir imagem.');
      }
    }
  };

  const setAsPrincipal = async (imageId) => {
    try {
        // Rota de PUT também não precisa de header especial
        await apiClient.put(`/uploads/produtos/${productId}/imagens/${imageId}/principal`);
        alert('Imagem principal definida com sucesso!');
        onUpdate();
    } catch (error) {
        alert('Erro ao definir imagem principal.');
    }
  };

  return (
    <div className={styles.managerSection}>
      <h3>Imagens</h3>
      <div className={styles.imageGrid}>
        {images.map(img => (
          <div key={img.id} className={styles.imageCard}>
            <Image src={img.url} alt={img.nome || "Imagem do produto"} width={150} height={150} style={{ objectFit: 'cover' }} />
            <div className={styles.imageActions}>
              <button onClick={() => setAsPrincipal(img.id)} title="Definir como principal" disabled={img.principal}>
                <Star size={18} fill={img.principal ? 'gold' : 'none'} />
              </button>
              <button onClick={() => handleDelete(img.id)} title="Excluir">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.uploadBox}>
        <label htmlFor="imageUpload">
          <Upload /> {uploading ? 'Enviando...' : 'Adicionar Novas Imagens'}
        </label>
        <input 
          id="imageUpload" 
          type="file" 
          multiple 
          onChange={handleImageUpload} 
          disabled={uploading}
          accept="image/png, image/jpeg, image/webp"
        />
      </div>
    </div>
  );
}