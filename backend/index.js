const express = require('express');
const PORT = 8080;
const path = require('path');
const productRouter = require('./database/routes/product.routes');
const app = express();

app.use(express.json());
app.use(productRouter);

app.use('/components', express.static(path.join(__dirname, 'components')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
const staticPath = path.join(__dirname, '../frontend/src/pages');

app.use(express.static(staticPath));
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/src/pages', 'index.html');
  console.log('Путь к index.html:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
