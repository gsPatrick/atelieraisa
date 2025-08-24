// app/pagamento/pendente/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import apiClient from '../../../services/api';
import styles from '../payment-status.module.css';

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get('pedido');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (pedidoId) {
      const fetchOrder = async () => {
        try {
          const response = await apiClient.get(`/pedidos/${pedidoId}`);
          setOrder(response.data);
        } catch (error) {
          console.error("Erro ao buscar pedido:", error);
        }
      };
      fetchOrder();
    }
  }, [pedidoId]);

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.pending}`}>
          <Clock size={40} />
        </div>
        <h1 className={styles.title}>Pagamento Pendente</h1>
        <p className={styles.subtitle}>
          Estamos aguardando a confirmação do pagamento. Assim que for aprovado, 
          iniciaremos a preparação do seu pedido e você será notificado por e-mail.
        </p>
        
        {order && (
          <div className={styles.orderDetails}>
            <p>Número do seu pedido: <strong>#{order.id}</strong></p>
          </div>
        )}

        <Link href="/perfil" className={styles.ctaButton}>
          Acompanhar status do pedido
        </Link>
      </div>
    </main>
  );
}