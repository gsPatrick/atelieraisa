// app/page.js

import Hero from '../components/Hero/Hero';
import FeaturedCollections from '../components/FeaturedCollections/FeaturedCollections'; // Importe o novo componente
import OurProcess from '../components/OurProcess/OurProcess'; // Importe o novo componente
import WeeklyHighlights from '../components/WeeklyHighlights/WeeklyHighlights'; // Importe o novo componente
import Testimonials from '../components/Testimonials/Testimonials'; // Importe o novo componente
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <FeaturedCollections />
      <OurProcess />
      <WeeklyHighlights />
      <Testimonials /> {/* Adicione a nova seção aqui */}
      {/* O Rodapé (Footer) virá a seguir */}
    </main>
  );
}