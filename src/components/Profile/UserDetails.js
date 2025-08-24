// src/components/Profile/UserDetails.js
'use client';

import { useState } from 'react';
import apiClient from '../../services/api';
import styles from './Profile.module.css';

export default function UserDetails({ initialData }) {
  const [formData, setFormData] = useState({
    nome: initialData.nome || '',
    email: initialData.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
  });
  const [message, setMessage] = useState('');

  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await apiClient.put('/usuarios/perfil', formData);
      setMessage('Dados atualizados com sucesso!');
    } catch (error) {
      setMessage(error.response?.data?.erro || 'Erro ao atualizar dados.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await apiClient.put('/usuarios/perfil/alterar-senha', passwordData);
      setMessage('Senha alterada com sucesso!');
      setPasswordData({ senhaAtual: '', novaSenha: '' }); // Limpa os campos
    } catch (error) {
      setMessage(error.response?.data?.erro || 'Erro ao alterar senha.');
    }
  };

  return (
    <div className={styles.contentPanel}>
      <h3 className={styles.panelTitle}>Meus Dados</h3>
      <p className={styles.panelSubtitle}>Aqui você pode atualizar seus dados cadastrais.</p>
      
      {message && <div className={styles.message}>{message}</div>}

      <form onSubmit={handleInfoSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="nome">Nome Completo</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInfoChange} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email" value={formData.email} readOnly />
        </div>
        <button type="submit" className={styles.submitButton}>Salvar Alterações</button>
      </form>

      <hr className={styles.divider} />

      <h3 className={styles.panelTitle}>Alterar Senha</h3>
      <form onSubmit={handlePasswordSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="senhaAtual">Senha Atual</label>
          <input type="password" id="senhaAtual" name="senhaAtual" value={passwordData.senhaAtual} onChange={handlePasswordChange} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="novaSenha">Nova Senha</label>
          <input type="password" id="novaSenha" name="novaSenha" value={passwordData.novaSenha} onChange={handlePasswordChange} />
        </div>
        <button type="submit" className={styles.submitButton}>Alterar Senha</button>
      </form>
    </div>
  );
}