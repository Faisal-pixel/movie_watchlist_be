import dotenv from 'dotenv';

dotenv.config(); // Load variables from .env

const config = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    dbPassword: process.env.DB_PASSWORD
}



export default config;