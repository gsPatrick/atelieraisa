// src/components/Pagination.js

import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className={styles.pagination}>
      <button onClick={handlePrev} disabled={currentPage === 1} className={styles.arrowButton}>
        <ChevronLeft size={18} />
        <span>Anterior</span>
      </button>
      <span className={styles.pageInfo}>
        Página {currentPage} de {totalPages}
      </span>
      <button onClick={handleNext} disabled={currentPage === totalPages} className={styles.arrowButton}>
        <span>Próximo</span>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}