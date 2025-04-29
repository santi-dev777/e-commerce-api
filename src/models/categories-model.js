import { pool } from "../database/database.js";

export class CategoryModel {
    
    static async getAll(){
        const [categories] = await pool.query(
            `SELECT * FROM categories`
        );
        return categories;
    }

    static async getById( id ){
        const [category] = await pool.query(
            'SELECT * FROM categories WHERE id = ?', [id]
        )
        return  category[0]
    }

    static async create({ input }){
        const {name, description} = input

        const [result] = await pool.query(
             `INSERT INTO categories (name, description)
             VALUES (?, ?)`,
             [name, description]
        )

        if (result.affectedRows === 0) return false

        return this.getById(result.insertId)
    }

    static async delete ({ id }){
        const [rows] = await pool.query(
            "DELETE FROM categories WHERE id = ?", [id]
        )

        if(rows.affectedRows <= 0) return false
    }

    static async update ({ id, input }){
        const { name, description } = input

        const [ rows ] = await pool.query(
            `UPDATE categories 
            SET name = IFNULL(?, name),
            description = IFNULL(?, description)
            WHERE id = ?`,
            [name, description, id]
        )

        if(rows.affectedRows === 0) return false

        return this.getById(id)
    }
}