// src/data/mockOrders.js

export const mockOrders = [
  {
    id: 'AR-1024',
    date: '15 de ago, 2023',
    status: 'Entregue',
    total: 139.80,
    items: [
      { name: 'Guardanapo de Linho Bordado Floral', quantity: 2 },
      { name: 'Pano de Prato "Doce Lar"', quantity: 1 },
    ]
  },
  {
    id: 'AR-1017',
    date: '28 de jul, 2023',
    status: 'Enviado',
    total: 129.90,
    items: [
      { name: 'Caminho de Mesa em Macramê', quantity: 1 },
    ]
  },
  {
    id: 'AR-1005',
    date: '02 de jun, 2023',
    status: 'Cancelado',
    total: 69.90,
    items: [
      { name: 'Toalha de Lavabo Imperial com Renda', quantity: 1 },
    ]
  }
];