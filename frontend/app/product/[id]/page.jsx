'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './productPage.module.css';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productId = params.id;

        // Запрос к вашему API
        const response = await fetch(`/api/product/${productId}`);

        if (!response.ok) {
          throw new Error('Товар не найден');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки товара');
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product && product.quantity > 0) {
      // Логика добавления в корзину
      console.log('Добавлено в корзину:', { product, quantity });
      alert(`Добавлено ${quantity} шт. товара "${product.name}" в корзину`);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка товара...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <h2>{error || 'Товар не найден'}</h2>
        <p>Попробуйте найти другой товар</p>
        <Link href="/" className={styles.backButton}>
          ← Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Хлебные крошки */}
      <nav className={styles.breadcrumbs}>
        <Link href="/">Главная</Link>
        <span> / </span>
        <span className={styles.current}>{product.name}</span>
      </nav>

      <div className={styles.productWrapper}>
        {/* Левая часть - изображение */}
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            {product.img && !imageError ? (
              <Image
                src={product.img}
                alt={product.name}
                className={styles.productImage}
                width={600}
                height={400}
                priority
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span className={styles.placeholderIcon}>🛍️</span>
                <p>Изображение товара</p>
              </div>
            )}
          </div>

          {product.quantity === 0 && (
            <div className={styles.outOfStockBadge}>Нет в наличии</div>
          )}
        </div>

        {/* Правая часть - информация */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            {product.brand && (
              <span className={styles.brand}>{product.brand}</span>
            )}
            <h1 className={styles.title}>{product.name}</h1>

            {product.sku && (
              <div className={styles.sku}>
                Артикул: <span>{product.sku}</span>
              </div>
            )}
          </div>

          <div className={styles.priceSection}>
            <div className={styles.currentPrice}>
              {formatPrice(product.price)}
            </div>

            <div className={styles.stockStatus}>
              {product.quantity > 0 ? (
                <div className={styles.inStock}>
                  <span className={styles.statusIcon}>✓</span>
                  <span>В наличии: {product.quantity} шт.</span>
                </div>
              ) : (
                <div className={styles.outOfStock}>
                  <span className={styles.statusIcon}>✗</span>
                  <span>Нет в наличии</span>
                </div>
              )}
            </div>
          </div>

          {/* Описание */}
          <div className={styles.description}>
            <h3>Описание</h3>
            <div className={styles.descriptionContent}>
              {product.description || 'Описание отсутствует'}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className={styles.actions}>
            {product.quantity > 0 ? (
              <>
                <div className={styles.quantitySelector}>
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className={styles.quantityButton}
                    aria-label="Уменьшить количество"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= product.quantity) {
                        setQuantity(val);
                      }
                    }}
                    className={styles.quantityInput}
                    aria-label="Количество товара"
                  />
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(product.quantity, prev + 1)
                      )
                    }
                    disabled={quantity >= product.quantity}
                    className={styles.quantityButton}
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    onClick={handleAddToCart}
                    className={`${styles.button} ${styles.cartButton}`}
                    disabled={product.quantity === 0}
                  >
                    <span className={styles.buttonIcon}>🛒</span>
                    Добавить в корзину
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className={`${styles.button} ${styles.buyButton}`}
                    disabled={product.quantity === 0}
                  >
                    Купить сейчас
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.notAvailable}>
                <p>Товар временно отсутствует</p>
                <button
                  onClick={() => router.back()}
                  className={styles.backButton}
                >
                  Вернуться назад
                </button>
              </div>
            )}
          </div>

          {/* Дополнительная информация */}
          <div className={styles.additionalInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🚚</span>
              <div>
                <strong>Бесплатная доставка</strong>
                <p>При заказе от 5000₽</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>↩️</span>
              <div>
                <strong>Возврат товара</strong>
                <p>В течение 14 дней</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка назад для мобильных */}
      <div className={styles.mobileBack}>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Назад к товарам
        </button>
      </div>
    </div>
  );
}
