// app/catalogo/[slug]/page.js (INTEGRADO COM API)

// Esta página será renderizada no servidor para melhor SEO
import { notFound } from 'next/navigation';
import apiClient, { API_URL } from '../../../services/api'; // Usaremos a baseURL para chamadas no servidor
import ProductGallery from '../../../components/ProductGallery/ProductGallery';
import ProductInfo from '../../../components/ProductInfo/ProductInfo';
import RelatedProducts from '../../../components/RelatedProducts/RelatedProducts';
import styles from './page.module.css';

// Função para buscar os dados do produto no servidor
async function getProductData(slug) {
  try {
    // Usamos a URL completa pois esta chamada é feita no lado do servidor
    const productRes = await fetch(`${API_URL}/produtos/${slug}`, { next: { revalidate: 60 } }); // Cache de 60s

    if (!productRes.ok) {
        // Se o produto não for encontrado (404), a função notFound() será chamada abaixo
        return { product: null, related: [] };
    }
    
    const product = await productRes.json();

    // Busca produtos relacionados baseados no ID do produto encontrado
    const relatedRes = await fetch(`${API_URL}/produtos/${product.id}/relacionados`, { next: { revalidate: 3600 } }); // Cache de 1h
    const related = await relatedRes.json();

    return { product, related };
  } catch (error) {
    console.error("Falha ao buscar dados do produto:", error);
    // Retorna nulo para que a página possa lidar com o erro (mostrar 404)
    return { product: null, related: [] };
  }
}


// A função da página agora é assíncrona
export default async function ProductDetailPage({ params }) {
  const { slug } = params;
  const { product, related } = await getProductData(slug);

  // Se o produto não for encontrado, exibe a página 404 do Next.js
  if (!product) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className={styles.productContainer}>
        <div className={styles.galleryWrapper}>
          {/* Passa as imagens e o nome do produto para a galeria */}
          <ProductGallery images={product.imagens} productName={product.nome} />
        </div>
        <div className={styles.infoWrapper}>
          {/* Passa o objeto completo do produto para o ProductInfo */}
          <ProductInfo product={product} />
        </div>
      </div>
      {/* Passa os produtos relacionados para o componente */}
      <RelatedProducts relatedProducts={related} />
    </main>
  );
}