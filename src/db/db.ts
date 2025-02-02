import config from "../Config/config";
import { Pool } from "pg";

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'movie_watchlist_app',
//     password: config.dbPassword,
//     port: 5432
// });

const pool = new Pool({
    connectionString: config.supabaseDatabaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;