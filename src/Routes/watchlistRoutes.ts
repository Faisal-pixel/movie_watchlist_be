import express, { Request, Response } from 'express';
import pool from '../db/db';
import { body, param, validationResult } from 'express-validator';
import { comparePassword, hashPasword } from '../Utils/passwordUtils';
import { generateToken } from '../Utils/generateTokenUtils';
import { authenticatToken } from '../middlewares/authMiddleware';
import { IRequest } from 'src/types/reques.type';
import { getUserId } from '../Utils/getUserIdUtils';
// 1. To create a new watchlist we need to save into our database user_id, created_at, and the name of the watchlist.
// TO the above we can get the token from the user, verify the token and get the user_id from the token. Then we can use it to save into the
// watchlist table
// Return the name of the watchlist

// 2. To get a new watchlist, they pass in the token, we decrypt the token and get the user_id, then we query the database for the watchlist
// that belongs to the user_id

const router = express.Router();

// CREATE NEW WATCHLIST
router.post('/create-watchlist', authenticatToken, body("watchlist_name").notEmpty().withMessage("Watchlist name is required") ,async (req: IRequest, res: Response) => {
    const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) {
            res.status(400).json({"success": false, errors: validationErrors.array(), message: 'Invalid input'});
            return;
        }

    const {email} = req.user;
    const {watchlist_name} = req.body;

    try {
        // We can get the user_id by querying the username in the database
        const user = await getUserId(email, res);
        const {id} = user || {};

        // If the watchlist already exists, we return a status of 400
        const watchlistExists = await pool.query('SELECT * FROM watchlist WHERE user_id = $1 AND watchlist_name = $2', [id, watchlist_name]);
        if(watchlistExists.rows.length > 0) {
            res.status(400).json({success: false, message: "Watchlist already exists"});
            return;
        }

        const created_at = new Date();

        const result = await pool.query("INSERT INTO watchlist (user_id, watchlist_name, created_at) VALUES ($1, $2, $3) RETURNING id", [id, watchlist_name, created_at]);

        res.status(201).json({success: true, message: "Watchlist created successfully", data: result.rows[0]});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({success: false, message: "Server error", error: error.message});
            return;
        }
    }
});

// GET A PARTICULAR WATCHLIST /get-watchlist/:watchlist_id
// 1. Firstly pass it to express validator. We need to make sure that the watchlist_id is not empty
// 2. We need to make sure that the current user has access and if the watchlist exists
// 3. If it does exists we return information about the watchlist.

router.get('/get-watchlist/:watchlist_id', authenticatToken, param("watchlist_id").notEmpty().withMessage("Watchlist ID is required"), async (req: IRequest, res: Response) => {
    const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) {
            res.status(400).json({"success": false, errors: validationErrors.array(), message: 'Invalid input'});
            return;
        }

    const {email} = req.user;
    const {watchlist_id} = req.params;

    try {
        // We can get the user_id by querying the username in the database
        const user = await getUserId(email, res);
        const {id} = user || {};


        const watchlist = await pool.query('SELECT * FROM watchlist WHERE user_id = $1 AND id = $2', [id, watchlist_id]);
        if(watchlist.rows.length === 0) {
            res.status(400).json({success: false, message: "Watchlist does not exist or unauthorized access"});
            return;
        }

        res.status(200).json({success: true, message: "Watchlist queried succesfully", data: watchlist.rows[0]});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({success: false, message: "Server error", error: error.message});
            return;
        }
    }
});

// DELETE A WATCHLIST /delete-watchlist/:watchlist_id

router.delete('/delete-watchlist/:watchlist_id', authenticatToken, param("watchlist_id").notEmpty().withMessage("Watchlist ID is required"), async (req: IRequest, res: Response) => {
    // Firstly we validate the input
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        res.status(400).json({"success": false, errors: validationErrors.array(), message: 'Invalid input'});
        return;
    }
    // Then we destructure the email and watchlist_id from the request
    const {email} = req.user;
    const {watchlist_id} = req.params;

    try {
        // We can get the user_id by querying the username in the database
        const user = await getUserId(email, res);
        const {id} = user || {};

        const watchlist = await pool.query('SELECT * FROM watchlist WHERE user_id = $1 AND id = $2', [id, watchlist_id]);
        if(watchlist.rows.length === 0) {
            res.status(400).json({success: false, message: "Watchlist does not exist or unauthorized access"});
            return;
        }

        await pool.query('DELETE FROM watchlist WHERE id = $1', [watchlist_id]);

        res.status(200).json({success: true, message: "Watchlist deleted succesfully"});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({success: false, message: "Server error", error: error.message});
            return;
        }
    }
})

export default router;