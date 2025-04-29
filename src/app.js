import express,{json} from "express"
import { createProductsRouter } from "./routes/products-router.js"
import { corsMiddleware } from "./middlewares/cors.js"

export const createApp = ({ productModel }) => {
    const app = express()
    app.use(json())
    app.use(corsMiddleware())

    app.use("/products", createProductsRouter({ productModel }))

    const PORT = process.env.PORT ?? 1234

    app.listen(PORT, () => {
        console.log(`server listening on port http://localhost:${PORT}`)
    })

}
