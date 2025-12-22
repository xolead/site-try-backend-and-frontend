'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import ProductCard from '@/components/productCard/ProductCard';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

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

  // Функция удаления товара
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Ошибка удаления: ${response.status}`);
      }

      // Удаляем товар из состояния
      setProducts((prev) => prev.filter((product) => product.id !== productId));

      // Показываем уведомление (можно заменить на toast)
      alert('Товар успешно удалён!');
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      alert('Ошибка при удалении товара');
    }
  };

  // Функция редактирования товара
  const handleEditProduct = (product) => {
    // Перенаправляем на страницу редактирования
    // Создай отдельную страницу редактирования или используй модальное окно
    router.push(`/edit/${product.id}`);

    // Или показываем модальное окно для быстрого редактирования:
    // setEditingProduct(product);
    // setIsEditModalOpen(true);
  };

  // Функция добавления в корзину
  const handleAddToCart = (product) => {
    // Логика добавления в корзину
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} добавлен в корзину!`);

    // Можно обновить счетчик корзины в Header
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Заголовок и статистика */}
          <div className={styles.pageHeader}>
            <h1 className={styles.title}>Интернет-магазин электроники</h1>
            <div className={styles.headerActions}>
              <p className={styles.subtitle}>
                {products.length > 0
                  ? `Найдено ${products.length} товаров`
                  : 'Нет товаров в наличии'}
              </p>
              <button
                onClick={() => router.push('/create')}
                className={styles.createButton}
              >
                ➕ Добавить товар
              </button>
            </div>
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
                      onDelete={handleDeleteProduct}
                      onEdit={handleEditProduct}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🛒</div>
                  <h2>Товаров пока нет</h2>
                  <p>Будьте первым, кто добавит товар!</p>
                  <button
                    onClick={() => router.push('/create')}
                    className={styles.addProductButton}
                  >
                    Добавить товар
                  </button>
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
