import { pool } from "../database/database.js";

export class ProductModel {

  // Methods basic crud

    static async getAll() {
        const [products] = await pool.query(
        `SELECT 
            p.*,COALESCE(
                JSON_ARRAYAGG(
                    IF(c.id IS NOT NULL,
                        JSON_OBJECT(
                            'id', c.id,
                            'name', c.name
                        ),
                        NULL
                    )
                ),
                JSON_ARRAY()
            ) AS categories
        FROM products p
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON c.id = pc.category_id
        GROUP BY p.id, p.name, p.description, p.price, p.stock, p.image_url, p.created_at, p.updated_at`);
        
        // Filtrar valores NULL en el array de categorías
        return products.map(product => {
            if (product.categories && product.categories[0] === null && product.categories.length === 1) {
                product.categories = [];
            }
            return product;
        });
    }

    static async getById(id) {
        const [products] = await pool.query(
            `SELECT 
                p.*, COALESCE(
                    JSON_ARRAYAGG(
                        IF(c.id IS NOT NULL,
                            JSON_OBJECT(
                                'id', c.id,
                                'name', c.name
                            ),
                            NULL
                        )
                    ),
                    JSON_ARRAY()
                ) AS categories
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON c.id = pc.category_id
            WHERE p.id = ?
            GROUP BY p.id`, [id]);
        
        if (products.length === 0) return null;
        
        const product = products[0];
        
        // Filtrar valores NULL en el array de categorías
        if (product.categories && product.categories[0] === null && product.categories.length === 1) {
            product.categories = [];
        }
        return product;
    }

    static async create({ input }) {
        const {
          name,
          description,
          price,
          stock,
          image_url,
          categories
        } = input;
      
        // Insertar el producto
        const [result] = await pool.query(
          `INSERT INTO products 
          (name, description, price, stock, image_url)
          VALUES (?, ?, ?, ?, ?)`,
          [name, description, price, stock, image_url]
        );
      
        const productId = result.insertId;
      
        // Si hay categorías, validar e insertar en tabla intermedia
        if (categories && categories.length > 0) {
          const categoryIds = categories.map(cat =>
            typeof cat === 'object' && cat.id ? cat.id : cat
          );
      
          // Validar existencia de las categorías
          await this.validateCategoryIds(categoryIds);
      
          // Crear relaciones en tabla product_categories
          const values = categoryIds.map(categoryId => [productId, categoryId]);
          await pool.query(
            `INSERT INTO product_categories (product_id, category_id) VALUES ?`,
            [values]
          );
        }
      
        // Retornar el producto recién creado
        return this.getById(productId);
      }
      

    static async delete ({ id }) {
        const [rows] = await pool.query(
            `DELETE FROM products WHERE id = ?`, [id]
        );

        if(rows.affectedRows <= 0) {
            return false;
        }
        
        return true;
    }

    static async update({ id, input }) {
        const {
          name,
          description,
          price,
          stock,
          image_url,
          categories
        } = input;
      
        // Actualizar campos del producto
        const [result] = await pool.query(
          `UPDATE products 
           SET name = IFNULL(?, name), 
               description = IFNULL(?, description), 
               price = IFNULL(?, price), 
               stock = IFNULL(?, stock), 
               image_url = IFNULL(?, image_url)
           WHERE id = ?`,
          [name, description, price, stock, image_url, id]
        );
      
        if (result.affectedRows === 0) return false;
      
        // Si se enviaron categorías, procesar la actualización
        if (Array.isArray(categories)) {
          const categoryIds = categories.map(cat =>
            typeof cat === 'object' && cat.id ? cat.id : cat
          );
      
          // Validar que las categorías existan
          await this.validateCategoryIds(categoryIds);
      
          // Eliminar relaciones anteriores
          await pool.query(
            `DELETE FROM product_categories WHERE product_id = ?`,
            [id]
          );
      
          // Insertar nuevas relaciones
          if (categoryIds.length > 0) {
            const values = categoryIds.map(categoryId => [id, categoryId]);
            await pool.query(
              `INSERT INTO product_categories (product_id, category_id) VALUES ?`,
              [values]
            );
          }
        }
      
        // Retornar producto actualizado con categorías
        return this.getById(id);
      }

  
    static async validateCategoryIds(categoryIds) {
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) return;
      
        const [existingCategories] = await pool.query(
          `SELECT id FROM categories WHERE id IN (?)`,
          [categoryIds]
        );
      
        if (existingCategories.length !== categoryIds.length) {
          throw new Error('Una o más categorías no existen');
        }
      }

    //Filter products by category
    static async filterByCategory(categoryId) {
        const [products] = await pool.query(
          `SELECT 
          p.*,
          COALESCE(
            JSON_ARRAYAGG(
              IF(c.id IS NOT NULL,
                JSON_OBJECT('id', c.id, 'name', c.name),
                NULL
              )
            ),
            JSON_ARRAY()
          ) AS categories
          FROM products p
          INNER JOIN product_categories pc ON p.id = pc.product_id
          INNER JOIN categories c ON c.id = pc.category_id AND c.id = ?
          GROUP BY p.id`, 
            [categoryId]
        );
        
        // Filtrar valores NULL en el array de categorías
        return products.map(product => {
            if (product.categories && product.categories[0] === null && product.categories.length === 1) {
                product.categories = []
            }
            return product
        });
    }
}