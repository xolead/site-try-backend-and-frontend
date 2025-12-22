// components/layout/Header.jsx
import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  const cartCount = 3; // Пример

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Логотип */}
        <Link href="/" className={styles.logo}>
          🛍️ Магазин Анно
        </Link>

        {/* Навигация */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Главная
          </Link>
          <Link href="/create" className={styles.navLink}>
            Добавить товары
          </Link>
          {/* <Link href="/cart" className={styles.navLink}>
            <span className={styles.cartIcon}>
              🛒
              {cartCount > 0 && (
                <span className={styles.cartCount}>{cartCount}</span>
              )}
            </span>
          </Link> */}
          {/* 
          <button className={styles.loginButton}>Войти</button> */}
        </nav>
      </div>
    </header>
  );
}
