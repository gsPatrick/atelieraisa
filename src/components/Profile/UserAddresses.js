// src/components/Profile/UserAddresses.js
'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, Home } from 'lucide-react';
import apiClient from '../../services/api';
import styles from './Profile.module.css';

export default function UserAddresses({ initialAddresses, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', nome: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await apiClient.delete(`/enderecos/${id}`);
        onUpdate(); // Chama a função do pai para recarregar a lista
      } catch (error) {
        setMessage('Erro ao excluir endereço.');
      }
    }
  };

  const handleSetPrincipal = async (id) => {
    try {
      await apiClient.post(`/enderecos/${id}/principal`);
      onUpdate();
    } catch (error) {
      setMessage('Erro ao definir como principal.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/enderecos', formData);
      setShowForm(false);
      onUpdate();
    } catch (error) {
      setMessage('Erro ao salvar endereço.');
    }
  };

  return (
    <div className={styles.contentPanel}>
      <div className={styles.panelHeader}>
        <div>
          <h3 className={styles.panelTitle}>Meus Endereços</h3>
          <p className={styles.panelSubtitle}>Gerencie seus locais de entrega.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className={styles.addNewButton}>
            <PlusCircle size={18} /> Adicionar Novo
          </button>
        )}
      </div>
      
      {message && <div className={styles.message}>{message}</div>}

      {showForm ? (
        <form onSubmit={handleSubmit} className={styles.form}>
           {/* Campos do formulário de endereço (CEP, Rua, etc.) */}
           <div className={styles.inputGroup}>
              <label htmlFor="nome">Apelido do Endereço (ex: Casa, Trabalho)</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required />
            </div>
            {/* ... adicione os outros campos como na página de cadastro ... */}
            <div className={styles.formActions}>
                <button type="button" onClick={() => setShowForm(false)} className={styles.cancelButton}>Cancelar</button>
                <button type="submit" className={styles.submitButton}>Salvar Endereço</button>
            </div>
        </form>
      ) : (
        <div className={styles.addressList}>
          {initialAddresses.map(addr => (
            <div key={addr.id} className={`${styles.addressCard} ${addr.principal ? styles.principal : ''}`}>
              <div className={styles.addressInfo}>
                {addr.principal && <span className={styles.principalBadge}><Home size={14}/> Principal</span>}
                <strong>{addr.nome}</strong>
                <p>{`${addr.rua}, ${addr.numero} - ${addr.bairro}`}</p>
                <p>{`${addr.cidade}, ${addr.estado} - CEP: ${addr.cep}`}</p>
              </div>
              <div className={styles.addressActions}>
                {!addr.principal && <button onClick={() => handleSetPrincipal(addr.id)}>Tornar Principal</button>}
                <button onClick={() => handleDelete(addr.id)} className={styles.deleteButton}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}