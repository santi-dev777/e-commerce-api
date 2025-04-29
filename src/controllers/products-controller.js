import { ValidateProduct, ValidatePartialProduct } from "../utils/products.js";

export class ProductsController {
    constructor ({productModel}){
        this.ProductModel = productModel;
    }

    getAll = async (req, res) => {
        try {
            const products = await this.ProductModel.getAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const product = await this.ProductModel.getById(id);
            if(product) return res.status(200).json(product);
            res.status(404).json({ error: 'Product not found' });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    create = async (req, res) => {
        try {
            const result = ValidateProduct(req.body)
            if (!result.success) {
                return res.status(400).json({ error: result.error.message })
            }
            
            try {
                const newProduct = await this.ProductModel.create({ input: result.data })
                res.status(201).json(newProduct)
            } catch (error) {
                // Si el error es específico de categorías, devolver un 404
                if (error.message === 'Una o más categorías no existen') {
                    return res.status(404).json({ error: error.message })
                }
                // Para otros errores, devolver un 500
                throw error
            }
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    };

    update = async (req, res) => {
        try {
            const result = ValidatePartialProduct(req.body)
            if (!result.success) {
                return res.status(400).json({ error: result.error.message })
            }

            const updatedProduct = await this.ProductModel.update({ id: req.params.id, input: result.data })

            if (!updatedProduct) return res.status(404).json({ error: 'Product not found' })

            res.status(200).json(updatedProduct)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    };

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.ProductModel.delete({ id });
            if (!result) return res.status(404).json({ error: 'Product not found' });
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}