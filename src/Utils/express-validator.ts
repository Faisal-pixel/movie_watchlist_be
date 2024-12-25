import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateErrors = (req: Request, res: Response, next: NextFunction) => {
    console.log("Validating...")
    const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) {
            console.log("Validation failed")
            res.status(400).json({"success": false, errors: validationErrors.array(), message: 'Invalid input'});
            return;
        }

        next();
}