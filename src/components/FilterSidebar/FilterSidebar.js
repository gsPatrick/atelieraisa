// src/components/FilterSidebar/FilterSidebar.js (AJUSTADO PARA NOVAS PROPS)

'use client';

import { motion } from 'framer-motion';
import styles from './FilterSidebar.module.css';

// categories agora espera um array de objetos: { value: 'slug', label: 'Nome' }
export default function FilterSidebar({ categories, activeCategory, onCategoryChange, sortOrder, onSortChange }) {
  return (
    <motion.aside 
      className={styles.sidebar}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.filterGroup}>
        <h3 className={styles.title}>Categorias</h3>
        <ul className={styles.categoryList}>
          {categories.map(category => (
            <li key={category.value}>
              <button
                className={`${styles.categoryButton} ${activeCategory === category.value ? styles.active : ''}`}
                onClick={() => onCategoryChange(category.value)}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.title}>Ordenar por</h3>
        <select 
          className={styles.sortSelect} 
          value={sortOrder} 
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="default">Padrão</option>
          <option value="price-asc">Preço: Menor para o Maior</option>
          <option value="price-desc">Preço: Maior para o Menor</option>
          <option value="newest">Mais Recentes</option>
        </select>
      </div>
    </motion.aside>
  );
}