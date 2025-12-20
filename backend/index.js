const express = require('express');
const PORT = 8080;
const productRouter = require('./database/routes/product.routes');
const app = express();

app.use(express.json());
app.use(productRouter);

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
