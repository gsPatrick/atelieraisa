// app/layout.js (versão final)

import { Great_Vibes, Montserrat, Open_Sans } from 'next/font/google';
import Header from '../components/Header/Header'; // Verifique se o caminho está correto
import Footer from '../components/Footer/Footer'; // Importe o Footer
import { CartProvider } from '../context/CartContext'; // MUDANÇA: Importar o provider
import CartDrawer from '../components/CartDrawer/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer/WishlistDrawer';

import './globals.css';

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-open-sans',
});

export const metadata = {
  title: 'Ateliê Raisa - Peças Artesanais com Amor',
  description: 'Descubra peças artesanais que transformam momentos em memórias.',
};


export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${greatVibes.variable} ${montserrat.variable} ${openSans.variable}`}>
        <CartProvider>
          <Header />
          {/* Adiciona os drawers aqui para que fiquem sobre todo o conteúdo e sejam controlados pelo contexto */}
          <CartDrawer />
          <WishlistDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
