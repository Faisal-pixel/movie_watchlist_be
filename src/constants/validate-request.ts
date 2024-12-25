import { body, param, validationResult } from 'express-validator';
import {Response, NextFunction} from 'express'
import { IRequest } from 'src/types/reques.type';
import { validateErrors } from 'src/Utils/express-validator';
export const editWatchlistValidateRequest = [
    param("watchlist_id").notEmpty().withMessage("Watchlist ID is required"),
    body('watchlist_name').optional().isString().withMessage('Watchlist name must be a string'),
    body('description').optional().isString().withMessage('Watchlist description must be a string'),
    validateErrors
]