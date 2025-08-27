// app/produtos/page.js (REATORADO PARA FILTRO NO FRONT-END)

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
  
  // --- MUDANÇA 1: Novos estados para gerenciar os produtos ---
  const [allProducts, setAllProducts] = useState([]); // Guarda TODOS os produtos da API
  const [filteredProducts, setFilteredProducts] = useState([]); // Guarda os produtos após filtro e ordenação
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para controle da paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Lê o parâmetro 'categoria' da URL para o estado inicial
  const [activeCategory, setActiveCategory] = useState(searchParams.get('categoria') || 'all');
  const [sortOrder, setSortOrder] = useState('default');

  // --- MUDANÇA 2: Efeito para buscar TODOS os dados (produtos e categorias) uma única vez ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Busca as categorias primeiro para usar no filtro
        const categoriesResponse = await apiClient.get('/categorias');
        const activeCategories = [{ id: 'all', slug: 'all', nome: 'Todas' }, ...categoriesResponse.data];
        setCategories(activeCategories);

        // Busca TODOS os produtos (removendo paginação e filtros da chamada inicial)
        const productsResponse = await apiClient.get('/produtos?limit=999'); // Limite alto para pegar todos
        setAllProducts(productsResponse.data.produtos);
        
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- MUDANÇA 3: Efeito principal para FILTRAR e ORDENAR os produtos no front-end ---
  // Este efeito roda sempre que os filtros, a ordenação ou a lista principal de produtos mudam.
  useEffect(() => {
    let productsToProcess = [...allProducts];

    // 1. Filtrar por Categoria
    if (activeCategory !== 'all') {
      // Encontra o ID da categoria com base no slug ativo
      const categoryObject = categories.find(c => c.slug === activeCategory);
      if (categoryObject) {
        productsToProcess = productsToProcess.filter(p => p.categoriaId === categoryObject.id);
      }
    }

    // 2. Ordenar
    switch (sortOrder) {
      case 'price-asc':
        productsToProcess.sort((a, b) => parseFloat(a.variacoes[0]?.preco || 0) - parseFloat(b.variacoes[0]?.preco || 0));
        break;
      case 'price-desc':
        productsToProcess.sort((a, b) => parseFloat(b.variacoes[0]?.preco || 0) - parseFloat(a.variacoes[0]?.preco || 0));
        break;
      case 'newest':
        productsToProcess.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Mantém a ordem padrão (geralmente por data de criação, vindo da API)
        break;
    }

    setFilteredProducts(productsToProcess);
    setCurrentPage(1); // Sempre reseta para a primeira página ao aplicar um novo filtro

  }, [activeCategory, sortOrder, allProducts, categories]);


  // --- MUDANÇA 4: Lógica de paginação agora é no front-end ---
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  }, [filteredProducts]);

  // Calcula quais produtos mostrar na página atual
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Funções para atualizar os filtros
  const handleCategoryChange = (categorySlug) => {
    setActiveCategory(categorySlug);
  };

  const handleSortChange = (sortValue) => {
    setSortOrder(sortValue);
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
              // --- MUDANÇA 5: Passa os produtos da página atual para o grid ---
              <ProductGrid products={currentProducts} />
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