// src/components/OrderCard.js (CORRIGIDO COM VERIFICAÇÃO DE SEGURANÇA)

import { Package, Truck, XCircle } from 'lucide-react';
import styles from './OrderCard.module.css';

const statusMap = {
  'Entregue': { icon: <Package size={18} />, color: 'green' },
  'Enviado': { icon: <Truck size={18} />, color: 'blue' },
  'Cancelado': { icon: <XCircle size={18} />, color: 'red' },
  // Adicionando status faltantes para robustez
  'pago': { icon: <Package size={18} />, color: 'blue' },
  'processando': { icon: <Package size={18} />, color: 'blue' },
};

export default function OrderCard({ order }) {
  // Se não houver pedido, não renderiza nada para evitar erros.
  if (!order) {
    return null;
  }

  const { icon, color } = statusMap[order.status] || { icon: <Package size={18} />, color: 'gray' };

  // Formata a data para um formato mais legível
  const formattedDate = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.orderId}>
          <h4>Pedido #{order.id}</h4>
          <span>{formattedDate}</span>
        </div>
        <div className={`${styles.status} ${styles[color]}`}>
          {icon}
          <span>{order.status}</span>
        </div>
      </div>
      <div className={styles.body}>
        <ul className={styles.itemList}>
          {/* --- MUDANÇA: Adicionada verificação de segurança aqui --- */}
          {/* Garante que o map só será executado se order.items for um array */}
          {Array.isArray(order.items) && order.items.map((item, index) => (
            <li key={index}>{item.quantidade}x {item.nome}</li>
          ))}
        </ul>
      </div>
      <div className={styles.footer}>
        <span>Total</span>
        <strong>R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}</strong>
      </div>
    </div>
  );
}