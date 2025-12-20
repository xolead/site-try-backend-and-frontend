const db = require("../db.js");

class productController {
  async createProduct(req, res) {
    const { name, description, price, quantity, img } = req.body;
    const newProduct = await db.query(
      `INSERT INTO products (name, description, price, quantity, img)
                                            VALUES (1$, 2$, 3$, 4$, 5$) RETURNING *`,
      [name, description, price, quantity, img]
    );
    res.json(newProduct.rows[0]);
  }

  async getProducts(req, res) {
    const products = await db.query(
      `SELECT id, name, description, price, quantity, img FROM products`
    );
    res.json(products.rows);
  }

  async getProduct(req, res) {
    const id = req.params.id;
    const product = await db.query(
      `SELECT id, name, description, price, quantity, img FROM products WHERE id = $1`,
      [id]
    );
    res.json(product.rows);
  }

  async updateProduct(req, res) {
    const { id, name, description, price, quantity, img } = req.body;
    const newProduct = await db.query(
      `UPDATE products SET 
                                            name = $1, description = $2, 
                                            price = $3, quantity = $4, 
                                            img = $5, WHERE id = $6
                                         RETURNING`,
      [name, description, price, quantity, img, id]
    );
    res.json(newProduct.rows[0]);
  }

  async deleteProduct(req, res) {
    const id = req.params.id;
    const product = await db.query(`DELETE FROM products WHERE id = $1`, [id]);
  }
}

module.exports = new productController();
