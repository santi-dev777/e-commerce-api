import { Router } from "express";
import { CategoriesController } from "../controllers/categories-controller.js";

export const createCategoriesRouter = ({ categoryModel }) => {
    const router = Router();

    const categoriesController = new CategoriesController({ categoryModel });

    router.get("/", categoriesController.getAll);

    router.get("/:id", categoriesController.getById);

    router.post("/", categoriesController.create);

    router.patch("/:id", categoriesController.update);

    router.delete("/:id", categoriesController.delete);

    return router;
}
