// src/data/mockData.js

export const mockProducts = [
  { 
    id: 1, 
    name: 'Guardanapo de Linho Bordado Floral', 
    slug: 'guardanapo-linho-bordado-floral',
    category: 'Mesa Posta', 
    price: 49.90, 
    images: [
      '/images/product-guardanapo-linho.jpg',
      '/images/product-jogo-americano.jpg', // Nota: Substitua por imagens reais do produto
      '/images/product-pano-prato.jpg',
    ],
    description: "Uma peça de pura delicadeza, bordada à mão em linho de alta qualidade. Cada flor é um pequeno ponto de arte, trazendo a beleza de um jardim para a sua mesa.",
    details: "100% Linho | Medidas: 45cm x 45cm | Bordado com linha de algodão mercerizado.",
    care: "Lavar à mão com sabão neutro. Não usar alvejante. Secar à sombra e passar a ferro ainda úmido.",
    isExclusive: true 
  },
  { 
    id: 2, 
    name: 'Jogo Americano Rústico Bege', 
    slug: 'jogo-americano-rustico-bege',
    category: 'Mesa Posta', 
    price: 89.90, 
    images: [
      '/images/product-jogo-americano.jpg',
      '/images/product-caminho-mesa.jpg',
    ],
    description: "Aconchego e elegância se encontram neste jogo americano de trama rústica. Perfeito para refeições do dia a dia ou para receber convidados com um toque de charme.",
    details: "Algodão Cru | Medidas: 35cm x 50cm | Acabamento com franjas.",
    care: "Pode ser lavado à máquina em ciclo delicado. Secar à sombra.",
    isExclusive: false 
  },
  { 
    id: 3, 
    name: 'Pano de Prato "Doce Lar"', 
    slug: 'pano-de-prato-doce-lar',
    category: 'Cozinha', 
    price: 34.90, 
    images: ['/images/product-pano-prato.jpg'],
    description: "Um toque de carinho para a sua cozinha. Feito em sacaria de alta absorção, com barrado em tecido estampado e um bordado que aquece o coração.",
    details: "100% Algodão | Medidas: 50cm x 70cm | Barrado em tricoline.",
    care: "Lavar à máquina. Pode ser passado a ferro em alta temperatura.",
    isExclusive: false 
  },
  { 
    id: 4, 
    name: 'Caminho de Mesa em Macramê', 
    slug: 'caminho-de-mesa-em-macrame',
    category: 'Decoração', 
    price: 129.90, 
    images: ['/images/product-caminho-mesa.jpg'],
    description: "Uma peça statement que traz a beleza do artesanal para o centro das atenções. Feito à mão com a técnica de macramê, adiciona textura e personalidade à sua decoração.",
    details: "Barbante de Algodão Ecológico | Medidas: 30cm x 120cm.",
    care: "Limpar com pano úmido ou escova macia. Não submergir em água.",
    isExclusive: true 
  },
  { 
    id: 5, 
    name: 'Toalha de Lavabo Imperial com Renda', 
    slug: 'toalha-lavabo-imperial-renda',
    category: 'Banho', 
    price: 69.90, 
    images: ['/images/product-guardanapo-linho.jpg'],
    description: "Elegância para o seu lavabo. Toalha felpuda de alta qualidade com aplicação de renda guipir, um detalhe que faz toda a diferença.",
    details: "100% Algodão Egípcio | Medidas: 30cm x 50cm | Renda Guipir.",
    care: "Lavar à mão ou em ciclo delicado. Não usar alvejante.",
    isExclusive: false 
  },
  { 
    id: 6, 
    name: 'Kit Sousplat de Crochê (4 peças)', 
    slug: 'kit-sousplat-croche-4-pecas',
    category: 'Mesa Posta', 
    price: 119.90, 
    images: ['/images/product-jogo-americano.jpg'],
    description: "Vista sua mesa com o charme do crochê. Este kit de sousplats é perfeito para criar uma base acolhedora para suas refeições especiais.",
    details: "Barbante de Algodão | Diâmetro: 38cm | Contém 4 unidades.",
    care: "Lavar à mão e secar na horizontal para não deformar.",
    isExclusive: false 
  },
  { 
    id: 7, 
    name: 'Flâmula Decorativa "Sonhe Alto"', 
    slug: 'flamula-decorativa-sonhe-alto',
    category: 'Decoração', 
    price: 79.90, 
    images: ['/images/product-pano-prato.jpg'],
    description: "Uma mensagem de inspiração para decorar qualquer cantinho especial. Bordada em algodão cru, com acabamento em madeira e cordão para pendurar.",
    details: "Algodão Cru e Madeira Pinus | Medidas: 20cm x 30cm.",
    care: "Limpar com espanador ou pano seco.",
    isExclusive: false 
  },
  { 
    id: 8, 
    name: 'Porta-copos de Folha em Macramê', 
    slug: 'porta-copos-folha-macrame',
    category: 'Mesa Posta', 
    price: 59.90, 
    images: ['/images/product-caminho-mesa.jpg'],
    description: "Detalhes que encantam. Estes porta-copos em formato de folha são um charme e protegem seus móveis com estilo.",
    details: "Barbante de Algodão | Contém 4 unidades.",
    care: "Limpar com escova macia. Não molhar.",
    isExclusive: false 
  },
  { 
    id: 9, 
    name: 'Bate-mão para Cozinha', 
    slug: 'bate-mao-cozinha',
    category: 'Cozinha', 
    price: 45.00, 
    images: ['/images/product-pano-prato.jpg'],
    description: "Praticidade e beleza para sua cozinha. Com tecido atoalhado de alta absorção e um topo decorado para pendurar, é um item indispensável.",
    details: "Tecido Atoalhado e Tricoline | Alça com botão de pressão.",
    care: "Lavar à máquina.",
    isExclusive: false 
  },
  { 
    id: 10, 
    name: 'Cesta de Piquenique em Vime', 
    slug: 'cesta-piquenique-vime',
    category: 'Decoração', 
    price: 189.90, 
    images: ['/images/product-caminho-mesa.jpg'],
    description: "Crie memórias inesquecíveis com esta cesta de vime clássica. Perfeita para piqueniques ou como um charmoso item de decoração.",
    details: "Vime Natural e Forro de Tecido | Medidas: 40cm x 30cm x 20cm.",
    care: "Limpar com pano úmido.",
    isExclusive: true 
  },
  { 
    id: 11, 
    name: 'Kit Toalhas de Banho Bordadas', 
    slug: 'kit-toalhas-banho-bordadas',
    category: 'Banho', 
    price: 249.90, 
    images: ['/images/product-guardanapo-linho.jpg'],
    description: "Um abraço macio após o banho. Kit com toalhas de banho e rosto bordadas com monograma, um luxo para o seu dia a dia.",
    details: "100% Algodão Fio Penteado | Contém 1 toalha de banho e 1 de rosto.",
    care: "Lavar à máquina. Não usar amaciante em excesso para não perder a absorção.",
    isExclusive: false 
  },
  { 
    id: 12, 
    name: 'Avental de Cozinha "Chef da Casa"', 
    slug: 'avental-cozinha-chef-da-casa',
    category: 'Cozinha', 
    price: 89.90, 
    images: ['/images/product-pano-prato.jpg'],
    description: "Cozinhe com estilo! Avental de brim resistente com bolso frontal e alças reguláveis, bordado com uma frase divertida.",
    details: "Brim 100% Algodão | Tamanho único com regulagem.",
    care: "Lavar à máquina.",
    isExclusive: false 
  },
  { 
    id: 13, 
    name: 'Porta-guardanapo de Argola Dourada', 
    slug: 'porta-guardanapo-argola-dourada',
    category: 'Mesa Posta', 
    price: 79.90, 
    images: ['/images/product-jogo-americano.jpg'],
    description: "O toque final de sofisticação para a sua mesa. Kit de porta-guardanapos com argolas de metal dourado e detalhe floral.",
    details: "Metal e Flores Artificiais | Contém 4 unidades.",
    care: "Limpar com pano seco.",
    isExclusive: false 
  },
  { 
    id: 14, 
    name: 'Almofada de Linho com Textura', 
    slug: 'almofada-linho-textura',
    category: 'Decoração', 
    price: 110.00, 
    images: ['/images/product-caminho-mesa.jpg'],
    description: "Conforto e design para seu sofá ou cama. Capa de almofada em linho com uma textura sutil que adiciona profundidade e elegância ao ambiente.",
    details: "Linho Misto | Medidas: 45cm x 45cm | Fechamento com zíper invisível.",
    care: "Lavar à mão ou em ciclo delicado.",
    isExclusive: false 
  },
];