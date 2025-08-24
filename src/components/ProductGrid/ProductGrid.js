// src/components/ProductGrid.js

import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return <p className={styles.noResults}>Nenhum produto encontrado com os filtros selecionados.</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}