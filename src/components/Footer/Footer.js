// src/components/Footer.js (CRÉDITOS ATUALIZADOS)

import Link from 'next/link';
import { Instagram, Facebook, MessageCircle } from 'lucide-react'; 
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.whatsappSection}>
        <div className={styles.whatsappContent}>
          <h3 className={styles.whatsappTitle}>Atendimento Personalizado</h3>
          <p className={styles.whatsappSubtitle}>
            Ficou com alguma dúvida? Chame a gente no WhatsApp! Será um prazer ajudar com seus pedidos, dúvidas e projetos especiais.
          </p>
          <a 
            href="https://wa.me/5518981109568?text=Ol%C3%A1%2C%20tudo%20bem%3F" // Lembre-se de colocar o número correto aqui
            className={styles.whatsappButton}
            target="_blank" 
            rel="noopener noreferrer"
          >
            <MessageCircle size={20} />
            <span>Conversar no WhatsApp</span>
          </a>
        </div>
      </div>

      <div className={styles.mainFooter}>
        <div className={styles.footerGrid}>
          <div className={styles.logoColumn}>
            <Link href="/">
              <span className={styles.logoPrimary}>Ateliê</span>
              <span className={styles.logoSecondary}>Raisa</span>
            </Link>
            <p className={styles.logoTagline}>Peças artesanais que transformam momentos em memórias.</p>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Navegue</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Início</Link></li>
              <li><Link href="/catalogo">Catálogo</Link></li>
              <li><Link href="/sobre">Sobre Nós</Link></li>
            </ul>
          </div>

          <div className={styles.socialColumn}>
            <h4 className={styles.columnTitle}>Siga-nos</h4>
            <div className={styles.socialIcons}>
              <a href="https://www.instagram.com/raisaatelie?igsh=NHBueTAycWM3bml4" aria-label="Instagram" className={styles.socialLink}><Instagram size={20} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* --- MUDANÇA EXECUTADA AQUI --- */}
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Ateliê Raisa. Todos os direitos reservados.</p>
        <p>
          Desenvolvido por{' '}
          <a 
            href="https://codebypatrick.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.devLink}
          >
            Patrick.Developer
          </a>
        </p>
      </div>
    </footer>
  );
}