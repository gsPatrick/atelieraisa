// app/admin/(dashboard)/clientes/page.js
'use client';

import { useEffect, useState } from 'react';
import apiClient from '../../../../services/api';
import styles from '../admin-page.module.css';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    apiClient.get('/usuarios')
      .then(res => setClients(res.data.usuarios))
      .catch(err => console.error("Erro ao buscar clientes", err));
  }, []);

  return (
    <div>
      <h1 className={styles.pageTitle}>Clientes</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Ativo</th>
            <th>Data de Cadastro</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.nome}</td>
              <td>{client.email}</td>
              <td>{client.tipo}</td>
              <td>{client.ativo ? 'Sim' : 'Não'}</td>
              <td>{new Date(client.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}