// app/layout.jsx
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

// Настройка Montserrat
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'], // Поддерживаем кириллицу
  weight: ['400', '500', '600', '700'], // Выбираем нужные начертания
  variable: '--font-montserrat', // CSS переменная
});

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
