import { ValidateCategory, ValidatePartialCategory } from "../schemas/categories.js";

export class CategoriesController {
    constructor ({categoryModel}) {
        this.CategoryModel = categoryModel;
    }

    getAll = async (req, res) => {
        try {
            const categories = await this.CategoryModel.getAll();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: "error on found" });
        }
    }
    
    getById = async (req,res) => {
        try {
            const { id } = req.params;
            const category = await this.CategoryModel.getById(id);
            if(category) return res.status(200).json(category);
            res.status(404).json({ error: 'Category not found' });
        } catch (error) {
            res.status(500).json({ error: "error on found" });
        }
    }

    create = async (req, res) => {
        try {
            const result = ValidateCategory(req.body)
            if (!result.success) {
                return res.status(400).json({ error: JSON.parse(result.error.message) })
            }

            const newCategory = await this.CategoryModel.create({ input: result.data })
            res.status(201).json(newCategory)

        } catch (error) {
            res.status(500).json({ error: "error in create category" })
        }
    }

    update = async (req, res) => {
        try {
            const result = ValidatePartialCategory(req.body)
            if (!result.success) {
                return res.status(400).json({ error: JSON.parse(result.error.message) })
            }

            const updatedCategory = await this.CategoryModel.update({ id: req.params.id, input: result.data })
            if (!updatedCategory) return res.status(404).json({ error: 'Category not found' })

            res.status(200).json(updatedCategory)
        } catch (error) {
            res.status(500).json({ error: "error in update category"})
        }
    }

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.CategoryModel.delete({ id });
            console.log(result)
            if (!result) return res.status(404).json({ error: 'Category not found' });

            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: "error in delete category" });
        }
    }
}