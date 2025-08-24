// src/components/Footer.js (CORRIGIDO)

import Link from 'next/link';
import { Mail, Instagram, Facebook } from 'lucide-react'; // A correção está aqui
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.newsletterSection}>
        <div className={styles.newsletterContent}>
          <h3 className={styles.newsletterTitle}>Receba nossas Novidades</h3>
          <p className={styles.newsletterSubtitle}>
            Cadastre-se para receber inspirações, lançamentos e descontos especiais diretamente no seu e-mail.
          </p>
          <form className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className={styles.newsletterInput} 
              required 
            />
            <button type="submit" className={styles.newsletterButton}>Cadastrar</button>
          </form>
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
              <li><Link href="/colecoes">Coleções</Link></li>
              <li><Link href="/produtos">Todos os Produtos</Link></li>
              <li><Link href="/sobre">Sobre Nós</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Ajuda</h4>
            <ul className={styles.linkList}>
              <li><Link href="/faq">Dúvidas Frequentes</Link></li>
              <li><Link href="/contato">Contato</Link></li>
              <li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li>
              <li><Link href="/termos-de-uso">Termos de Uso</Link></li>
            </ul>
          </div>

          <div className={styles.socialColumn}>
            <h4 className={styles.columnTitle}>Siga-nos</h4>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Instagram" className={styles.socialLink}><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook" className={styles.socialLink}><Facebook size={20} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Ateliê Raisa. Todos os direitos reservados.</p>
        <p>Desenvolvido com ♡</p>
      </div>
    </footer>
  );
}