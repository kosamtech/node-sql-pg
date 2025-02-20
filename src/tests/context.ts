import { randomBytes } from "node:crypto";
import format from "pg-format";
import { PoolConfig } from "pg";
import * as dotenv from "dotenv";
import { runner } from "node-pg-migrate";
import pool from "../pool";

dotenv.config();

const DEFAULT_OPTS: PoolConfig = {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    database: process.env.POSTGRES_TEST_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

class Context {
    static async setUp() {
        const roleName = `a${randomBytes(4).toString("hex")}`;

        // Connect to PG as usual
        await pool.connect(DEFAULT_OPTS);

        // Create a new role
        await pool.query(
            format(
                `CREATE ROLE %I WITH LOGIN PASSWORD %L;`,
                roleName,
                roleName,
            ),
        );

        // Create a schema with the same name
        await pool.query(
            format(`CREATE SCHEMA %I AUTHORIZATION %I;`, roleName, roleName),
        );

        // Disconnect entirely from PG
        await pool.close();

        // Run our migrations in the new schema
        await runner({
            schema: roleName,
            direction: "up",
            noLock: true,
            dir: "migrations",
            databaseUrl: {
                host: process.env.POSTGRES_HOST,
                port: parseInt(process.env.POSTGRES_PORT || "5432"),
                database: process.env.POSTGRES_TEST_DB,
                user: roleName,
                password: roleName,
            },
            migrationsTable: "pgmigrations",
        });

        // Connect to PG as the newly created role
        await pool.connect({
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT || "5432"),
            database: process.env.POSTGRES_TEST_DB,
            user: roleName,
            password: roleName,
        });

        return new Context(roleName);
    }

    constructor(public roleName: string) {}

    async close() {
        // Disconnect from PG
        await pool.close();

        // Reconnect as our root user
        await pool.connect(DEFAULT_OPTS);

        // Delete the role and schema we created
        await pool.query(format(`DROP SCHEMA %I CASCADE;`, this.roleName));
        await pool.query(format("DROP ROLE %I;", this.roleName));

        await pool.close();
    }

    async clearTable() {
        await pool.query(`DELETE * FROM users;`);
    }
}

export default Context;
