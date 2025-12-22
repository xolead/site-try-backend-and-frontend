'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import ProductCard from '@/components/productCard/ProductCard';
import styles from './page.module.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загружаем товары при монтировании
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/product');

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setError('');
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить товары');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Заголовок и статистика */}
          <div className={styles.pageHeader}>
            <h1 className={styles.title}>Интернет-магазин электроники</h1>
            <p className={styles.subtitle}>
              {products.length > 0
                ? `Найдено ${products.length} товаров`
                : 'Нет товаров в наличии'}
            </p>
          </div>

          {/* Состояния загрузки/ошибки */}
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Загрузка товаров...</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={loadProducts} className={styles.retryButton}>
                Попробовать снова
              </button>
            </div>
          )}

          {/* Сетка товаров */}
          {!loading && !error && (
            <>
              {products.length > 0 ? (
                <div className={styles.productsGrid}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => console.log('Добавлен:', product.name)}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🛒</div>
                  <h2>Товаров пока нет</h2>
                  <p>Будьте первым, кто добавит товар!</p>
                  <a href="/create" className={styles.addProductButton}>
                    Добавить товар
                  </a>
                </div>
              )}
            </>
          )}

          {/* Кнопка обновления */}
          {!loading && products.length > 0 && (
            <div className={styles.refreshContainer}>
              <button onClick={loadProducts} className={styles.refreshButton}>
                🔄 Обновить список
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
