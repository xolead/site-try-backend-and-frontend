const db = require('../db.js');

class ProductController {
  async createProduct(req, res) {
    try {
      const { name, description, price, quantity, img } = req.body;
      console.log('Создание товара:', { name, price });

      const newProduct = await db.query(
        `INSERT INTO products (name, description, price, quantity, img)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, description, price, quantity, img]
      );

      res.status(201).json({
        success: true,
        product: newProduct.rows[0],
      });
    } catch (error) {
      console.error('Ошибка создания товара:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка при создании товара',
      });
    }
  }

  async getProducts(req, res) {
    try {
      const products = await db.query(
        `SELECT id, name, description, price, quantity, img FROM products`
      );
      res.json(products.rows);
    } catch (error) {
      console.error('Ошибка получения товаров:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка при загрузке товаров',
      });
    }
  }

  async getProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await db.query(
        `SELECT id, name, description, price, quantity, img FROM products WHERE id = $1`,
        [id]
      );

      if (product.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Товар не найден',
        });
      }

      res.json(product.rows[0]);
    } catch (error) {
      console.error('Ошибка получения товара:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка при загрузке товара',
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id, name, description, price, quantity, img } = req.body;
      console.log('Обновление товара ID:', id);

      const updatedProduct = await db.query(
        `UPDATE products SET 
         name = $1, description = $2, 
         price = $3, quantity = $4, 
         img = $5 WHERE id = $6 RETURNING *`,
        [name, description, price, quantity, img, id]
      );

      if (updatedProduct.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Товар не найден',
        });
      }

      res.json({
        success: true,
        product: updatedProduct.rows[0],
      });
    } catch (error) {
      console.error('Ошибка обновления товара:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка при обновлении товара',
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      console.log('Удаляем товар ID:', id);

      // Удаляем товар
      const result = await db.query(`DELETE FROM products WHERE id = $1`, [id]);

      console.log('Удалено строк:', result.rowCount);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Товар не найден',
        });
      }

      // Успешное удаление
      res.json({
        success: true,
        message: `Товар ${id} успешно удалён`,
        deletedId: id,
      });
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера при удалении',
        details: error.message,
      });
    }
  }
}

module.exports = new ProductController();
