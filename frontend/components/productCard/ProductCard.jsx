import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onAddToCart }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart();
    setIsAdding(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={styles.card}>
      {/* Изображение товара */}
      <div className={styles.imageContainer}>
        {product.img ? (
          <Image
            src={product.img}
            alt={product.name}
            width={280}
            height={200}
            className={styles.image}
            unoptimized // Для внешних изображений
          />
        ) : (
          <div className={styles.placeholderImage}>🛍️</div>
        )}

        {product.quantity === 0 && (
          <div className={styles.outOfStock}>Нет в наличии</div>
        )}
      </div>

      {/* Информация о товаре */}
      <div className={styles.content}>
        <Link href={`/product/${product.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>

        <p className={styles.description}>
          {product.description?.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description || 'Нет описания'}
        </p>

        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            <span className={styles.quantity}>
              {product.quantity > 0
                ? `Осталось: ${product.quantity} шт.`
                : 'Распродано'}
            </span>
          </div>

          <button
            className={`${styles.cartButton} ${
              product.quantity === 0 ? styles.disabled : ''
            }`}
            onClick={handleAddToCart}
            disabled={product.quantity === 0 || isAdding}
          >
            {isAdding ? (
              <>
                <span className={styles.spinner}></span>
                Добавляем...
              </>
            ) : product.quantity === 0 ? (
              'Нет в наличии'
            ) : (
              <>
                <span className={styles.cartIcon}>🛒</span>В корзину
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
