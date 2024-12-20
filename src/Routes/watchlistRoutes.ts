import express, { Request, Response } from 'express';
import pool from '../db/db';
import { body, param, validationResult } from 'express-validator';
import { comparePassword, hashPasword } from '../Utils/passwordUtils';
import { generateToken } from '../Utils/generateTokenUtils';
import { authenticatToken } from '../middlewares/authMiddleware';
import { IRequest } from 'src/types/reques.type';
import { getUserId } from '../Utils/getUserIdUtils';
import { TWatchlist } from 'src/types/frontend/frontend-types';
// 1. To create a new watchlist we need to save into our database user_id, created_at, and the name of the watchlist.
// TO the above we can get the token from the user, verify the token and get the user_id from the token. Then we can use it to save into the
// watchlist table
// Return the name of the watchlist

// 2. To get a new watchlist, they pass in the token, we decrypt the token and get the user_id, then we query the database for the watchlist
// that belongs to the user_id

const router = express.Router();

// CREATE NEW WATCHLIST
router.post('/create-watchlist', authenticatToken, body("watchlist_name").notEmpty().withMessage("Watchlist name is required"), body("description").notEmpty().withMessage("Description name is required") ,async (req: IRequest, res: Response) => {
    const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) {
            res.status(400).json({"success": false, errors: validationErrors.array(), message: 'Invalid input'});
            return;
        }

    const {email} = req.user;
    const {watchlist_name, description} = req.body;

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

        const result = await pool.query("INSERT INTO watchlist (user_id, watchlist_name, created_at, description) VALUES ($1, $2, $3, $4) RETURNING id", [id, watchlist_name, created_at, description]);

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

        // wm = watchlist_movie
        // const watchlist = await pool.query('SELECT * FROM watchlist WHERE user_id = $1 AND id = $2', [id, watchlist_id]);
        // Selecting all the listed columns joining it with the watchlist table but only if the watchlist id exists and the user_id is the 
        // same as the user_id in the token
        const queryRows = await pool.query('SELECT wm.watchlist_id, wm.tmdb_movie_id, wm.added_at, w.user_id, w.created_at, w.watchlist_name, w.description FROM watchlist_movie wm JOIN watchlist w ON wm.watchlist_id = w.id WHERE w.user_id = $1 AND w.id = $2', [id, watchlist_id]);
        if(queryRows.rows.length === 0) {
            res.status(400).json({success: false, message: "Watchlist does not exist or unauthorized access"});
            return;
        }
        const watchlist: TWatchlist = {
            watchlist_id: queryRows.rows[0].watchlist_id,
            user_id: queryRows.rows[0].user_id,
            created_at: queryRows.rows[0].created_at,
            watchlist_name: queryRows.rows[0].watchlist_name,
            description: queryRows.rows[0].description,
            movies: queryRows.rows.map((row: any) => { // Returns an array of movies
                return {
                    tmdb_movie_id: row.tmdb_movie_id,
                    added_at: row.added_at
                }
            })
        }
        res.status(200).json({success: true, message: "Watchlist queried succesfully", data: watchlist});
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({success: false, message: "Server error", error: error.message});
            return;
        }
    }
});

// GET ALL WATCHLISTS

router.get('/get-watchlists', authenticatToken, async (req: IRequest, res: Response) => {
    const {email} = req.user;

    try {
        // We can get the user_id by querying the username in the database
        const user = await getUserId(email, res);
        const {id} = user || {};

        const watchlists = await pool.query('SELECT * FROM watchlist WHERE user_id = $1', [id]);
        if(watchlists.rows.length === 0) {
            res.status(400).json({success: false, message: "No watchlist found"});
            return;
        }


        res.status(200).json({success: true, message: "Watchlists queried succesfully", data: watchlists.rows});
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