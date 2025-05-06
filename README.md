# e-commerce

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```

This project was created using `bun init` in bun v1.2.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## API Endpoints

### Productos (/products)

#### Obtener todos los productos
```http
GET /products
```

#### Filtrar productos por categoría
```http
GET /products/category/:categoryId
```

#### Obtener un producto por ID
```http
GET /products/:id
```

#### Crear un nuevo producto
```http
POST /products
```
Cuerpo de la petición (JSON):
```json
{
  "name": "Nombre del producto",
  "price": 99.99,
  "description": "Descripción del producto",
  "categoryId": [1,2,... ] //array de ids de categorias
}
```

#### Actualizar un producto
```http
PATCH /products/:id
```
Cuerpo de la petición (JSON):
```json
{
  "name": "Nuevo nombre",
  "price": 129.99,
  "description": "Nueva descripción",
  "categoryId": [1,2,... ] //array de ids de categorias
}
```

#### Eliminar un producto
```http
DELETE /products/:id
```

### Categorías (/categories)

#### Obtener todas las categorías
```http
GET /categories
```

#### Obtener una categoría por ID
```http
GET /categories/:id
```

#### Crear una nueva categoría
```http
POST /categories
```
Cuerpo de la petición (JSON):
```json
{
  "name": "Nombre de la categoría",
  "description": "Descripción de la categoría"
}
```

#### Actualizar una categoría
```http
PATCH /categories/:id
```
Cuerpo de la petición (JSON):
```json
{
  "name": "Nuevo nombre de la categoría",
  "description": "Nueva descripción de la categoría"
}
```

#### Eliminar una categoría
```http
DELETE /categories/:id
```
