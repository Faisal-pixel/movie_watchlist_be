import express, { Request, Response } from 'express';
import pool from '../db/db';
import { authenticatToken } from '../middlewares/authMiddleware';

const router = express.Router();


export default router;