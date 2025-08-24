// src/components/ProductGallery.js
'use client';
import { useState, useEffect } from 'react'; // Importar useEffect
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProductGallery.module.css';

// URL de uma imagem placeholder padrão.
const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

export default function ProductGallery({ images = [], productName }) {
  // --- MUDANÇA 1: Inicialização Segura do Estado ---
  // Se 'images' tiver conteúdo, usa a primeira imagem.
  // Se não, usa a imagem placeholder.
  const [selectedImage, setSelectedImage] = useState(images?.[0] || PLACEHOLDER_IMAGE);

  // --- MUDANÇA 2 (Bônus): Sincronizar com Mudanças de Props ---
  // Isso garante que se o usuário navegar entre produtos na mesma página (se aplicável),
  // a galeria se atualize corretamente.
  useEffect(() => {
    setSelectedImage(images?.[0] || PLACEHOLDER_IMAGE);
  }, [images]);


  // Se não houver imagens, podemos renderizar apenas o placeholder sem a galeria de thumbnails.
  if (!images || images.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.mainImageWrapper}>
          <Image
            src={PLACEHOLDER_IMAGE}
            alt={`Imagem indisponível para ${productName}`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.mainImage}
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage} // A chave continua sendo a URL da imagem
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              // --- MUDANÇA 3: Garantir que 'src' nunca seja nulo ou indefinido ---
              src={selectedImage || PLACEHOLDER_IMAGE}
              alt={`Imagem principal do produto ${productName}`}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.mainImage}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className={styles.thumbnailList}>
          {images.map((image, index) => (
            <button
              key={index}
              className={`${styles.thumbnailWrapper} ${selectedImage === image ? styles.active : ''}`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1} do produto ${productName}`}
                fill
                sizes="100px"
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}