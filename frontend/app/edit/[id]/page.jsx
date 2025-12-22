'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import styles from './edit.module.css';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    img: '',
  });

  // Загружаем товар при загрузке страницы
  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/product/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Товар не найден');
        }
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const data = await response.json();
      setProduct({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        quantity: data.quantity || '',
        img: data.img || '',
      });
    } catch (err) {
      console.error('Ошибка загрузки товара:', err);
      setError(err.message);

      // Через 3 секунды вернём на главную
      setTimeout(() => router.push('/'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Валидация
    if (!product.name.trim()) {
      setError('Введите название товара');
      setSaving(false);
      return;
    }

    if (!product.price || Number(product.price) <= 0) {
      setError('Введите корректную цену');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/product', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          quantity: Number(product.quantity) || 0,
          img: product.img || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Ошибка ${response.status}`);
      }

      setSuccess('✅ Товар успешно обновлён!');

      // Через 2 секунды возвращаем на главную
      setTimeout(() => {
        router.push('/');
        router.refresh(); // Обновляем данные на главной
      }, 2000);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      setError(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Ошибка ${response.status}`);
      }

      alert('✅ Товар успешно удалён!');
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert(`❌ Ошибка удаления: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Загрузка товара...</p>
        </div>
      </>
    );
  }

  if (error && !loading) {
    return (
      <>
        <Header />
        <div className={styles.errorContainer}>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <p>Перенаправление на главную страницу...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Редактирование товара
              <span className={styles.productId}>ID: {id}</span>
            </h1>
            <button onClick={handleCancel} className={styles.backButton}>
              ← Назад
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              {/* Название */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Название товара *</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Введите название"
                  required
                  disabled={saving}
                />
              </div>

              {/* Цена */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Цена (₽) *</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                  disabled={saving}
                />
              </div>

              {/* Количество */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Количество</label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="0"
                  min="0"
                  disabled={saving}
                />
              </div>

              {/* Изображение */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Ссылка на изображение</label>
                <input
                  type="text"
                  name="img"
                  value={product.img}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="https://example.com/image.jpg"
                  disabled={saving}
                />
                {product.img && (
                  <div className={styles.imagePreview}>
                    <img
                      src={product.img}
                      alt="Предпросмотр"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              {/* Описание */}
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Описание</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Опишите товар..."
                  rows={6}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Сообщения об ошибках/успехе */}
            {error && <div className={styles.errorMessage}>{error}</div>}

            {success && <div className={styles.successMessage}>{success}</div>}

            {/* Кнопки действий */}
            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleDelete}
                className={styles.deleteButton}
                disabled={saving}
              >
                {saving ? 'Удаление...' : '🗑️ Удалить товар'}
              </button>

              <div className={styles.rightActions}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.cancelButton}
                  disabled={saving}
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className={styles.buttonSpinner}></span>
                      Сохранение...
                    </>
                  ) : (
                    '💾 Сохранить изменения'
                  )}
                </button>
              </div>
            </div>

            {/* Информация о товаре */}
            <div className={styles.productInfo}>
              <h3>Информация о товаре до внесения изменений:</h3>
              <div className={styles.infoGrid}>
                <div>
                  <span className={styles.infoLabel}>ID:</span>
                  <span className={styles.infoValue}>{id}</span>
                </div>
                <div>
                  <span className={styles.infoLabel}>Название:</span>
                  <span className={styles.infoValue}>
                    {product.name || '—'}
                  </span>
                </div>
                <div>
                  <span className={styles.infoLabel}>Цена:</span>
                  <span className={styles.infoValue}>
                    {product.price
                      ? `${parseFloat(product.price).toLocaleString('ru-RU')} ₽`
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className={styles.infoLabel}>Количество:</span>
                  <span className={styles.infoValue}>
                    {product.quantity || 0} шт.
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
