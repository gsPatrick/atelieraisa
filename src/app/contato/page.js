// app/contato/page.js

import Link from 'next/link';
import { MessageSquare, Instagram, Mail } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';
import Accordion from '../../components/Accordion/Accordion';
import styles from './page.module.css';

const faqs = [
  {
    question: "Qual o prazo para produção e envio do meu pedido?",
    answer: "Nossas peças são feitas à mão com muito carinho. O prazo de produção é de até 7 dias úteis. Após a produção, o prazo de envio varia conforme a sua localidade e a modalidade de frete escolhida."
  },
  {
    question: "Vocês fazem peças personalizadas?",
    answer: "Adoramos criar peças únicas! Entre em contato conosco através do WhatsApp ou Instagram contando sua ideia, e teremos o prazer de avaliar a possibilidade de criar um projeto especial para você."
  },
  {
    question: "Como posso cuidar da minha peça artesanal?",
    answer: "Cada produto acompanha instruções de cuidado específicas. Em geral, recomendamos lavar à mão com delicadeza, não usar alvejantes e secar à sombra para preservar a beleza e a durabilidade da sua peça."
  }
];

export default function ContactPage() {
  return (
    <>
      <PageHeader 
        title="Vamos Conversar?"
        subtitle="Escolha seu novelo de linha preferido e vamos tecer uma boa conversa."
      />
      <main className={styles.main}>
        <div className={styles.contactGrid}>
          {/* Card de WhatsApp */}
          <Link href="https://www.instagram.com/raisaatelie?igsh=NHBueTAycWM3bml4" target="_blank" className={styles.contactCard}>
            <div className={styles.iconWrapper} style={{'--card-color': '#F8D7DA'}}>
              <MessageSquare size={32} />
            </div>
            <h3 className={styles.cardTitle}>WhatsApp</h3>
            <p className={styles.cardDescription}>
              Para dúvidas rápidas, personalizações ou apenas um "oi", estamos a uma mensagem de distância.
            </p>
            <span className={styles.cardAction}>Iniciar Conversa</span>
          </Link>

          {/* Card de Instagram */}
          <Link href="https://www.instagram.com/raisaatelie?igsh=NHBueTAycWM3bml4" target="_blank" className={styles.contactCard}>
            <div className={styles.iconWrapper} style={{'--card-color': '#E8B4B8'}}>
              <Instagram size={32} />
            </div>
            <h3 className={styles.cardTitle}>Instagram</h3>
            <p className={styles.cardDescription}>
              Inspire-se com nossos bastidores, novidades e envie uma DM. Adoramos nos conectar por lá!
            </p>
            <span className={styles.cardAction}>Seguir e Inspirar</span>
          </Link>

          {/* Card de E-mail */}
          <Link href="mailto:contato@atelie-raisa.com.br" className={styles.contactCard}>
            <div className={styles.iconWrapper} style={{'--card-color': '#F4E4BC'}}>
              <Mail size={32} />
            </div>
            <h3 className={styles.cardTitle}>E-mail</h3>
            <p className={styles.cardDescription}>
              Para assuntos mais detalhados, parcerias ou se preferir a calma do e-mail, escreva para nós.
            </p>
            <span className={styles.cardAction}>Enviar um E-mail</span>
          </Link>
        </div>

        {/* --- Seção de FAQ --- */}
        <div className={styles.faqSection}>
          <h2 className={styles.faqTitle}>Pequenos Bordados de Dúvidas</h2>
          <div className={styles.accordionContainer}>
            {faqs.map((faq, index) => (
              <Accordion key={index} title={faq.question}>
                <p>{faq.answer}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}