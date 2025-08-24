// src/components/Admin/AdminSidebar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Tag, Users, Ticket } from 'lucide-react';
import styles from './Admin.module.css';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/admin/produtos', label: 'Produtos', icon: <Package size={20} /> },
  { href: '/admin/pedidos', label: 'Pedidos', icon: <ShoppingCart size={20} /> },
  { href: '/admin/categorias', label: 'Categorias', icon: <Tag size={20} /> },
  { href: '/admin/clientes', label: 'Clientes', icon: <Users size={20} /> },
  { href: '/admin/cupons', label: 'Cupons', icon: <Ticket size={20} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/admin">Admin</Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}