// app/admin/(dashboard)/pedidos/page.js
'use client';

import { useEffect, useState } from 'react';
import apiClient from '../../../../services/api';
import styles from '../admin-page.module.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiClient.get('/pedidos')
      .then(res => setOrders(res.data.pedidos))
      .catch(err => console.error("Erro ao buscar pedidos", err));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/pedidos/${orderId}/status`, { status: newStatus });
      // Recarrega a lista para refletir a mudança
      apiClient.get('/pedidos').then(res => setOrders(res.data.pedidos));
    } catch (error) {
      alert('Erro ao atualizar status do pedido.');
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Pedidos</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Status</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.Usuario.nome}</td>
              <td>R$ {parseFloat(order.total).toFixed(2)}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <select 
                  value={order.status} 
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="processando">Processando</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}