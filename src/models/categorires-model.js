import pool from "../config/db.js";

export class CategoryModel {
    
    static async getAll(){
        const [categories] = await pool.query(
            `SELECT * FROM categories`
        );
        return categories;
    }
}