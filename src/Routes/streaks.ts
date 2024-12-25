import express, { Response } from 'express';
import pool from '../db/db';
import { authenticatToken } from '../middlewares/authMiddleware';
import { IRequest } from 'src/types/reques.type';
import { getUserId } from '../Utils/getUserIdUtils';
import { TStreak } from 'src/types/types';

const router = express.Router();

router.get("/", authenticatToken, async (req: IRequest, res: Response) => {
    const {email} = req.user;
    try {
        const user = await getUserId(email, res);
        const {id} = user || {};

        const streaks = await pool.query("SELECT * FROM streaks WHERE user_id = $1", [id]);
        const streakData: TStreak = streaks.rows[0];
        const responseData = {
            streak_count: streakData.streak_count,
            start_streak_date: streakData.start_streak_date,
            last_streak_update: streakData.last_streak_update
        }

        res.status(200).json({
            success: true,
            message: "Streaks fetched successfully",
            data: responseData
          });

        return;
    } catch (error) {
        
    }
})


export default router;