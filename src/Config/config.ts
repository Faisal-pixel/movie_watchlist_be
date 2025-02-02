import dotenv from 'dotenv';

dotenv.config(); // Load variables from .env

const config = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    dbPassword: process.env.DB_PASSWORD,
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    tmdbApiKey: process.env.TMDB_API_KEY,
    supabaseDatabaseUrl: process.env.SUPABASE_DATABASE_URL,
    supabaseDbHost: process.env.SUPABASE_DB_HOST,
    supabaseDbName: process.env.SUPABASE_DB_NAME,
    supabaseDbPassword: process.env.SUPABASE_DB_PASSWORD,
    supabaseDbPort: process.env.SUPABASE_DB_PORT,
    supabaseDbUser: process.env.SUPABASE_DB_USER,
}



export default config;