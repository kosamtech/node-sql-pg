import pool from "../pool";
import toCamelCase from "./utils/to-camel-case";

class UserRepository {
    static async find() {
        const result = await pool.query("SELECT * FROM users;");
        return toCamelCase(result?.rows as any[]);
    }

    static async findById(id: string) {
        const result = await pool.query("SELECT * FROM users WHERE id = $1;", [
            id,
        ]);
        return toCamelCase(result?.rows as any[])[0];
    }

    static async insert(username: string, bio: string) {
        const result = await pool.query(
            "INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *;",
            [username, bio],
        );
        return toCamelCase(result?.rows as any[])[0];
    }

    static async update(id: string, username: string, bio: string) {
        const result = await pool.query(
            `UPDATE users SET username = $1, bio = $2 WHERE id = $3 RETURNING *;`,
            [username, bio, id],
        );
        return toCamelCase(result?.rows as any[])[0];
    }

    static async delete(id: string) {
        const result = await pool.query(
            `DELETE FROM users WHERE id = $1 RETURNING*;`,
            [id],
        );
        return toCamelCase(result?.rows as any[])[0];
    }

    static async count() {
        const result = await pool.query(`SELECT COUNT(*) FROM users;`);
        console.log(result);
        return 0;
    }
}

export default UserRepository;
