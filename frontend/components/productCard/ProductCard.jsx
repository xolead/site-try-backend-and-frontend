'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './ProductCard.module.css';

export default function ProductCard({
  product,
  onDelete,
  onEdit,
  onAddToCart,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleDeleteClick = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(product.id);
    } catch (error) {
      console.error('Ошибка удаления:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(product);
    }
  };

  return (
    <div className={styles.card}>
      {/* Изображение товара */}
      <div className={styles.imageContainer}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholderImage}>🛍️</div>
        )}

        {/* Бейдж "Нет в наличии" */}
        {product.quantity === 0 && (
          <div className={styles.outOfStock}>Нет в наличии</div>
        )}

        {/* Кнопки управления (правый верхний угол) */}
        <div className={styles.controls}>
          <button
            onClick={handleEditClick}
            className={styles.editButton}
            title="Редактировать"
          >
            ✏️
          </button>

          <button
            onClick={handleDeleteClick}
            className={`${styles.deleteButton} ${
              showConfirm ? styles.confirm : ''
            }`}
            disabled={isDeleting}
            title={showConfirm ? 'Подтвердить удаление' : 'Удалить товар'}
          >
            {isDeleting ? (
              <span className={styles.miniSpinner}></span>
            ) : showConfirm ? (
              '❓'
            ) : (
              '🗑️'
            )}
          </button>
        </div>
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

          <div className={styles.actionButtons}>
            <button
              className={`${styles.cartButton} ${
                product.quantity === 0 ? styles.disabled : ''
              }`}
              onClick={() => onAddToCart(product)}
              disabled={product.quantity === 0}
            >
              <span className={styles.cartIcon}>🛒</span>
              Купить
            </button>
          </div>
        </div>
      </div>

      {/* Подтверждение удаления */}
      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <p>Удалить "{product.name}"?</p>
            <div className={styles.confirmActions}>
              <button
                onClick={handleDeleteClick}
                className={styles.confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Удаление...' : 'Да, удалить'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className={styles.cancelDelete}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
