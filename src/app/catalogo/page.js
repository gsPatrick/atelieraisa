// app/produtos/page.js (INTEGRADO COM API - CORRIGIDO)

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import apiClient from '../../services/api';
import PageHeader from '../../components/PageHeader/PageHeader';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import Pagination from '../../components/Pagination/Pagination';
import styles from './page.module.css';

const PRODUCTS_PER_PAGE = 9;

// Componente separado que usa useSearchParams
function CatalogContent() {
  const searchParams = useSearchParams();
  
  // Estados para os dados da API
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para controle da paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('categoria') || 'all');
  const [sortOrder, setSortOrder] = useState('default');

  // Efeito para buscar as categorias uma única vez quando o componente monta
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categorias');
        // Adiciona a opção "Todas" manualmente para o filtro
        setCategories([{ id: 'all', slug: 'all', nome: 'Todas' }, ...response.data]);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  // Efeito principal para buscar os produtos sempre que os filtros ou a página mudam
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Constrói os parâmetros da query para a API
        const params = new URLSearchParams({
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
          ordenarPor: sortOrder,
        });

        if (activeCategory !== 'all') {
          params.append('categorias', activeCategory);
        }

        const response = await apiClient.get(`/produtos?${params.toString()}`);
        
        setProducts(response.data.produtos);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, activeCategory, sortOrder]);

  // Funções para atualizar os filtros e resetar a página
  const handleCategoryChange = (categorySlug) => {
    setActiveCategory(categorySlug);
    setCurrentPage(1); // Reseta para a primeira página ao mudar o filtro
  };

  const handleSortChange = (sortValue) => {
    setSortOrder(sortValue);
    setCurrentPage(1); // Reseta para a primeira página ao mudar a ordenação
  };

  return (
    <>
      <PageHeader 
        title="Nosso Catálogo"
        subtitle="Descubra peças feitas à mão, criadas com carinho para encantar seu dia a dia."
      />
      <main className={styles.main}>
        <div className={styles.container}>
          <FilterSidebar 
            categories={categories.map(c => ({ value: c.slug, label: c.nome }))}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          <div className={styles.mainContent}>
            {isLoading ? (
              <p className={styles.loadingText}>Buscando as peças mais lindas...</p>
            ) : (
              <ProductGrid products={products} />
            )}
            
            {totalPages > 1 && !isLoading && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// Componente Loading para o Suspense
function CatalogLoading() {
  return (
    <>
      <PageHeader 
        title="Nosso Catálogo"
        subtitle="Descubra peças feitas à mão, criadas com carinho para encantar seu dia a dia."
      />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loadingText}>Carregando catálogo...</div>
        </div>
      </main>
    </>
  );
}

// Componente principal que envolve tudo no Suspense
export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  );
}