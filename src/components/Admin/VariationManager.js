// components/Admin/VariationManager.js
'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import apiClient from '../../services/api'; // Importa o cliente padrão
import styles from './Admin.module.css';

export default function VariationManager({ productId, initialVariations = [], onUpdate }) {
  const [variations, setVariations] = useState(initialVariations);

  // Sincroniza o estado se a lista inicial de props mudar
  useEffect(() => {
    setVariations(initialVariations);
  }, [initialVariations]);
  
  const handleAddVariation = () => {
    setVariations([...variations, { id: `new_${Date.now()}`, nome: '', preco: '0.00', estoque: 0, ativo: true, digital: false }]);
  };

  const handleChange = (id, field, value) => {
    setVariations(
      variations.map(v => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSave = async (variation) => {
    const isNew = String(variation.id).startsWith('new_');
    const payload = {
        nome: variation.nome,
        preco: variation.preco,
        estoque: variation.estoque,
        ativo: variation.ativo,
        digital: variation.digital
    };
    try {
      if (isNew) {
        // Usa o apiClient padrão para criar (envia JSON)
        await apiClient.post(`/produtos/${productId}/variacoes`, payload);
      } else {
        // Usa o apiClient padrão para atualizar (envia JSON)
        await apiClient.put(`/produtos/${productId}/variacoes/${variation.id}`, payload);
      }
      alert('Variação salva com sucesso!');
      onUpdate(); // Recarrega os dados na página pai
    } catch (error) {
      alert(`Erro ao salvar variação: ${error.response?.data?.erro || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (String(id).startsWith('new_')) {
        setVariations(variations.filter(v => v.id !== id));
        return;
    }
    if (window.confirm('Tem certeza que deseja excluir esta variação?')) {
      try {
        // Usa o apiClient padrão para deletar
        await apiClient.delete(`/produtos/${productId}/variacoes/${id}`);
        alert('Variação excluída com sucesso!');
        onUpdate();
      } catch (error) {
        alert('Erro ao excluir variação.');
      }
    }
  };

  return (
    <div className={styles.managerSection}>
      <div className={styles.managerHeader}>
        <h3>Variações (Preço, Estoque e Tipo)</h3>
        <button onClick={handleAddVariation} className={styles.addButton}><Plus size={16} /> Adicionar</button>
      </div>
      <div className={styles.variationList}>
        {variations.map(v => (
          <div key={v.id} className={styles.variationForm}>
            <input type="text" placeholder="Nome (ex: P, Azul)" value={v.nome} onChange={e => handleChange(v.id, 'nome', e.target.value)} />
            <input type="number" placeholder="Preço" value={v.preco} onChange={e => handleChange(v.id, 'preco', e.target.value)} step="0.01" />
            <input type="number" placeholder="Estoque" value={v.estoque} onChange={e => handleChange(v.id, 'estoque', e.target.value)} />
            <select value={v.digital} onChange={e => handleChange(v.id, 'digital', e.target.value === 'true')}>
                <option value={false}>Físico</option>
                <option value={true}>Digital</option>
            </select>
            <div className={styles.variationActions}>
                <button onClick={() => handleSave(v)} title="Salvar Variação"><Save size={18} /></button>
                <button onClick={() => handleDelete(v.id)} title="Excluir Variação"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}