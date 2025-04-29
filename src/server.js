import { createApp } from "./app.js"
import { ProductModel } from "./models/products-model.js"
import { CategoryModel } from "./models/categories-model.js"

createApp({ productModel: ProductModel, categoryModel: CategoryModel })