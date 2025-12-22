'use client'; // Это обязательно для использования useState и useEffect

import { useState } from 'react';
import styles from './page.module.css';
import { createProduct } from '@/utils/product.requests'; // Импортируй функцию
import Header from '../../components/header/Header';

export default function HomePage() {
  // Состояние для данных формы
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    img: '', // Добавил поле для изображения
  });

  // Состояние для индикатора загрузки
  const [isLoading, setIsLoading] = useState(false);
  // Состояние для сообщения об успехе/ошибке
  const [message, setMessage] = useState('');

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Проверка обязательных полей
    if (!formData.name.trim()) {
      setMessage('Введите название товара');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await createProduct(
        formData.name,
        formData.description,
        Number(formData.price), // Конвертируем в число
        Number(formData.quantity), // Конвертируем в число
        formData.img || null // Если изображение не указано - null
      );

      // Успех!
      setMessage('✅ Товар успешно создан!');

      // Очищаем форму
      setFormData({
        name: '',
        description: '',
        quantity: '',
        price: '',
        img: '',
      });
    } catch (error) {
      // Ошибка
      console.error('Ошибка при создании товара:', error);
      setMessage('❌ Ошибка при создании товара. Проверьте консоль.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.page}>
        <h1>Добавить новый товар</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.container_form_input}>
            {/* Название */}
            <div className={styles.container_name}>
              <input
                name="name"
                type="text"
                className={styles.form_input}
                placeholder="Введите название"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Описание */}
            <div className={styles.container_description}>
              <textarea // Изменил input на textarea для описания
                name="description"
                className={styles.form_input}
                placeholder="Введите описание"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            {/* Количество */}
            <div className={styles.container_quantity}>
              <input
                name="quantity"
                type="number"
                className={styles.form_input}
                placeholder="Введите количество"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            {/* Цена */}
            <div className={styles.container_price}>
              <input
                name="price"
                type="number"
                className={styles.form_input}
                placeholder="Введите цену"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>

            {/* Изображение (добавил новое поле) */}
            <div className={styles.container_img}>
              <input
                name="img"
                type="text"
                className={styles.form_input}
                placeholder="Ссылка на изображение (необязательно)"
                value={formData.img}
                onChange={handleInputChange}
              />
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              className={styles.submit_button}
              disabled={isLoading}
            >
              {isLoading ? 'Создание...' : 'Создать товар'}
            </button>

            {/* Сообщение об успехе/ошибке */}
            {message && (
              <div
                className={
                  message.includes('✅')
                    ? styles.success_message
                    : styles.error_message
                }
              >
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
