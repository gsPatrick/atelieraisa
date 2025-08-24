// src/components/OrderCard.js

import { Package, Truck, XCircle } from 'lucide-react';
import styles from './OrderCard.module.css';

const statusMap = {
  'Entregue': { icon: <Package size={18} />, color: 'green' },
  'Enviado': { icon: <Truck size={18} />, color: 'blue' },
  'Cancelado': { icon: <XCircle size={18} />, color: 'red' },
};

export default function OrderCard({ order }) {
  const { icon, color } = statusMap[order.status] || { icon: <Package size={18} />, color: 'gray' };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.orderId}>
          <h4>Pedido #{order.id}</h4>
          <span>{order.date}</span>
        </div>
        <div className={`${styles.status} ${styles[color]}`}>
          {icon}
          <span>{order.status}</span>
        </div>
      </div>
      <div className={styles.body}>
        <ul className={styles.itemList}>
          {order.items.map((item, index) => (
            <li key={index}>{item.quantity}x {item.name}</li>
          ))}
        </ul>
      </div>
      <div className={styles.footer}>
        <span>Total</span>
        <strong>R$ {order.total.toFixed(2).replace('.', ',')}</strong>
      </div>
    </div>
  );
}