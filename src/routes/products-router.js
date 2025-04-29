import { Router } from "express";
import { ProductsController } from "../controllers/products-controller.js";


export const createProductsRouter = ({ productModel }) => {
    const router = Router();

    const productsController = new ProductsController({ productModel });

    router.get("/", productsController.getAll);

    router.get("/:id", productsController.getById);

    router.post("/", productsController.create);

    router.patch("/:id", productsController.update);

    router.delete("/:id", productsController.delete);

    return router;
}
