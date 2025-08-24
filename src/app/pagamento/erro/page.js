// app/pagamento/erro/page.js
'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import styles from '../payment-status.module.css';

export default function PaymentErrorPage() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.error}`}>
          <XCircle size={40} />
        </div>
        <h1 className={styles.title}>Pagamento Recusado</h1>
        <p className={styles.subtitle}>
          Houve um problema ao processar seu pagamento. Por favor, verifique os dados 
          informados ou tente usar um método de pagamento diferente.
        </p>
        
        <Link href="/checkout" className={styles.ctaButton}>
          Tentar Novamente
        </Link>

        <Link href="/" className={styles.secondaryLink}>
          Voltar para a loja
        </Link>
      </div>
    </main>
  );
}