// app/pagamento/sucesso/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import apiClient from '@/api';
import styles from '../payment-status.module.css';

export default function PaymentSuccessPage() {
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
        <div className={`${styles.iconWrapper} ${styles.success}`}>
          <CheckCircle size={40} />
        </div>
        <h1 className={styles.title}>Pagamento Aprovado!</h1>
        <p className={styles.subtitle}>
          Seu pedido foi recebido e já estamos preparando tudo com muito carinho. 
          Você receberá as atualizações por e-mail.
        </p>
        
        {order && (
          <div className={styles.orderDetails}>
            <p>Número do seu pedido: <strong>#{order.id}</strong></p>
          </div>
        )}

        <Link href="/perfil" className={styles.ctaButton}>
          Acompanhar meus pedidos
        </Link>
      </div>
    </main>
  );
}