// src/components/Profile/UserOrders.js
import OrderCard from '../OrderCard/OrderCard';
import styles from './Profile.module.css';

export default function UserOrders({ orders }) {
  return (
    <div className={styles.contentPanel}>
      <h3 className={styles.panelTitle}>Histórico de Pedidos</h3>
      <p className={styles.panelSubtitle}>Acompanhe a jornada de cada peça feita para você.</p>
      {orders && orders.length > 0 ? (
        orders.map(order => <OrderCard key={order.id} order={order} />)
      ) : (
        <p>Você ainda não fez nenhum pedido.</p>
      )}
    </div>
  );
}   