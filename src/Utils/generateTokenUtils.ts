import jwt from 'jsonwebtoken';
import config from '../Config/config';

export const generateToken = (email: string, username: string): string => {
    const token = jwt.sign({email, username}, config.jwtSecret as string, {expiresIn: config.jwtExpiresIn});
    return token;
}