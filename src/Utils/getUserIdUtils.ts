import pool from "../db/db";

import { Response } from 'express';
import { TUser } from "src/types/types";

export const getUserId = async (email: string, res: Response) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(result.rows.length === 0) {
            res.status(400).json({success: false, message: "User does not exist"});
            return;
    }

    return result.rows[0] as TUser;
};