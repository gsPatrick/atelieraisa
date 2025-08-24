// app/admin/(dashboard)/produtos/editar/[id]/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '../../../../../../services/api';
import ImageManager from '../../../../../../components/Admin/ImageManager';
import VariationManager from '../../../../../../components/Admin/VariationManager';
import styles from '../../../admin-page.module.css';

export default function EditProductPage() {
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '', categoriaId: '', ativo: true });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // useCallback evita que a função seja recriada em cada renderização
  const fetchProductData = useCallback(async () => {
    if (id) {
      setIsLoading(true);
      try {
        const productRes = await apiClient.get(`/produtos/${id}`);
        const productData = productRes.data;
        setProduct(productData);
        setFormData({
          nome: productData.nome,
          descricao: productData.descricao || '',
          categoriaId: productData.categoriaId || '',
          ativo: productData.ativo,
        });
      } catch (error) {
        console.error("Erro ao buscar produto", error);
        alert('Produto não encontrado.');
        router.push('/admin/produtos');
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, router]);

  // Busca inicial dos dados
  useEffect(() => {
    apiClient.get('/categorias').then(res => setCategories(res.data));
    fetchProductData();
  }, [id, fetchProductData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handler para o formulário de dados principais (envia JSON)
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/produtos/${id}`, formData);
      alert('Dados principais atualizados com sucesso!');
      fetchProductData(); // Recarrega os dados para garantir consistência
    } catch (error) {
      alert('Erro ao atualizar os dados do produto.');
    }
  };

  if (isLoading || !product) {
    return <p>Carregando produto...</p>;
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Editar Produto: {product.nome}</h1>
      
      {/* Formulário de Dados Principais (não lida com uploads) */}
      <form onSubmit={handleInfoSubmit} className={styles.form}>
        <h3>Dados Principais</h3>
        <div className={styles.inputGroup}>
          <label htmlFor="nome">Nome</label>
          <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="descricao">Descrição</label>
          <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange}></textarea>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="categoriaId">Categoria</label>
          <select name="categoriaId" id="categoriaId" value={formData.categoriaId} onChange={handleChange} required>
            <option value="">Selecione...</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label><input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleChange} /> Ativo</label>
        </div>
        <button type="submit" className={styles.primaryButton}>Salvar Dados Principais</button>
      </form>

      <hr className={styles.divider} />

      {/* Gerenciador de Variações (lida com suas próprias requisições JSON) */}
      <VariationManager 
        productId={id} 
        initialVariations={product.variacoes} 
        onUpdate={fetchProductData} 
      />

      <hr className={styles.divider} />

      {/* Gerenciador de Imagens (lida com as requisições de upload) */}
      <ImageManager 
        productId={id} 
        initialImages={product.ArquivoProdutos ? product.ArquivoProdutos.filter(f => f.tipo === 'imagem') : []} 
        onUpdate={fetchProductData}
      />
    </div>
  );
}