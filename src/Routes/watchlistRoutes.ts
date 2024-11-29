import express, { Request, Response } from 'express';
import pool from '../db/db';
import { body, validationResult } from 'express-validator';
import { comparePassword, hashPasword } from '../Utils/passwordUtils';
import { generateToken } from '../Utils/generateTokenUtils';
import { authenticatToken } from '../middlewares/authMiddleware';
// 1. To create a new watchlist we need to save into our database user_id, created_at, and the name of the watchlist.
// TO the above we can get the token from the user, verify the token and get the user_id from the token. Then we can use it to save into the
// watchlist table
// Return the name of the watchlist

// 2. To get a new watchlist, they pass in the token, we decrypt the token and get the user_id, then we query the database for the watchlist
// that belongs to the user_id

const router = express.Router();

// Creating a new watchlist
router.post('/create', authenticatToken, async (req: Request, res: Response) => {
    console.log('Creating a new watchlist');
});