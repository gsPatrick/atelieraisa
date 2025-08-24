// app/produtos/page.js (INTEGRADO COM API)

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Hook para ler parâmetros da URL
import apiClient from '../../services/api';
import PageHeader from '../../components/PageHeader/PageHeader';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import Pagination from '../../components/Pagination/Pagination';
import styles from './page.module.css';

const PRODUCTS_PER_PAGE = 9;

export default function CatalogPage() {
  const searchParams = useSearchParams(); // Para ler a categoria da URL
  
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
            categories={categories.map(c => ({ value: c.slug, label: c.nome }))} // Passa as categorias no formato esperado
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