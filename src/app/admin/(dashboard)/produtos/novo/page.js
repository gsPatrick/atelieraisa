// app/admin/(dashboard)/produtos/novo/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../../../services/api';
import { Plus, Trash2 } from 'lucide-react';
import styles from '../../admin-page.module.css';

export default function NewProductPage() {
  const [formData, setFormData] = useState({ nome: '', descricao: '', categoriaId: '', ativo: true });
  const [variations, setVariations] = useState([{ id: Date.now(), nome: 'Padrão', preco: '0.00', estoque: 0, digital: false }]);
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    apiClient.get('/categorias').then(res => setCategories(res.data));
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = field === 'digital' ? value === 'true' : value;
    setVariations(newVariations);
  };

  const addVariation = () => {
    setVariations([...variations, { id: Date.now(), nome: '', preco: '0.00', estoque: 0, digital: false }]);
  };

  const removeVariation = (index) => {
    if (variations.length > 1) {
      setVariations(variations.filter((_, i) => i !== index));
    } else {
      alert('O produto deve ter pelo menos uma variação.');
    }
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const finalFormData = new FormData();
    finalFormData.append('nome', formData.nome);
    finalFormData.append('descricao', formData.descricao);
    finalFormData.append('categoriaId', formData.categoriaId);
    finalFormData.append('ativo', String(formData.ativo));

    // O backend espera as variações como uma string JSON
    finalFormData.append('variations', JSON.stringify(variations));

    // Anexa múltiplos arquivos sob a mesma chave 'files'
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        finalFormData.append('files', file); 
      });
    }

    try {
      // Envia a requisição POST com o header 'multipart/form-data'
      await apiClient.post('/produtos', finalFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Produto criado com sucesso!');
      router.push('/admin/produtos');

    } catch (error) {
      console.error("Erro ao criar produto:", error.response?.data || error.message);
      alert(error.response?.data?.erro || 'Erro ao criar produto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Novo Produto</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* DADOS PRINCIPAIS */}
        <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome do Produto</label>
            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleFormChange} required />
        </div>
        <div className={styles.inputGroup}>
            <label htmlFor="descricao">Descrição</label>
            <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleFormChange} rows="5"></textarea>
        </div>
        <div className={styles.inputGroup}>
            <label htmlFor="categoriaId">Categoria</label>
            <select name="categoriaId" id="categoriaId" value={formData.categoriaId} onChange={handleFormChange} required>
                <option value="">Selecione...</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
            </select>
        </div>
        <div className={styles.inputGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleFormChange} style={{ width: 'auto' }} /> Ativo na loja
            </label>
        </div>

        <hr className={styles.divider} />

        {/* VARIAÇÕES */}
        <h3>Variações (Preço, Estoque e Tipo)</h3>
        {variations.map((v, index) => (
            <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <input type="text" placeholder="Nome (ex: P, Azul)" value={v.nome} onChange={e => handleVariationChange(index, 'nome', e.target.value)} required/>
                <input type="number" placeholder="Preço (ex: 29.90)" value={v.preco} onChange={e => handleVariationChange(index, 'preco', e.target.value)} step="0.01" required/>
                <input type="number" placeholder="Estoque" value={v.estoque} onChange={e => handleVariationChange(index, 'estoque', e.target.value)} required/>
                <select value={v.digital} onChange={e => handleVariationChange(index, 'digital', e.target.value)} required>
                  <option value={false}>Físico</option>
                  <option value={true}>Digital</option>
                </select>
                <button type="button" onClick={() => removeVariation(index)}><Trash2 size={16}/></button>
            </div>
        ))}
        <button type="button" onClick={addVariation}><Plus size={16}/> Adicionar Variação</button>

        <hr className={styles.divider} />

        {/* IMAGENS */}
        <h3>Imagens</h3>
        <div className={styles.inputGroup}>
            <label htmlFor="images">Selecione uma ou mais imagens (a primeira será a principal)</label>
            <input type="file" name="images" id="images" onChange={handleImageChange} multiple accept="image/png, image/jpeg, image/webp" />
        </div>

        <hr className={styles.divider} />

        <button type="submit" className={styles.primaryButton} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Criar Produto'}
        </button>
      </form>
    </div>
  );
}