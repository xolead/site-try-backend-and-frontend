const express = require('express');
const cors = require('cors');
const productRouter = require('./database/routes/product.routes');

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(productRouter);

app.listen(PORT, () => {
  console.log(`Express сервер запущен на порту ${PORT}`);
});
