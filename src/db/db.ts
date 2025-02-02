import config from "../Config/config";
import { Pool } from "pg";

const pool = new Pool({
    user: config.supabaseDbUser,
    host: config.supabaseDbHost,
    database: config.supabaseDbName,
    password: config.dbPassword,
    port: Number(config.supabaseDbPort),
});

// const pool = new Pool({
//     connectionString: config.supabaseDatabaseUrl,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

export default pool;