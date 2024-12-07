import express, { Request, Response } from 'express';

import pool from '../db/db';
import { body, validationResult } from 'express-validator';
import { comparePassword, hashPasword } from '../Utils/passwordUtils';
import { generateToken } from '../Utils/generateTokenUtils';

const router = express.Router();

// We define the sign up route

// When signing up, I need the following information:
// firstname, lastname, username, email, password,

// first of all we want to get the errors from validationResult by passing in the request. We check this by checking if the validationResult.isEmpty()
// is true or false and then we send a status code of 400

// Then we deconstruct the values from the req.body object.

// Then we create a try catch block.
// Then we want to check if the user already exists. If the do, we send backa  response of 400 with a message that the user already exists.
// Inside the try block we use bcrypt to hash the password. We pass in the password and the number of rounds we want to hash the password.
// Then we insert the values into the database.
// Then we send a status code of user registered successfully
// In the catch block we send a status code of 500 and a message of server error.


router.post('/signup', [
    body('firstname').notEmpty().withMessage('Username is required'),
    body('lastname').notEmpty().withMessage('Lastname is required'),
    body('username').notEmpty().withMessage('Username is required').isLength({min: 3}).withMessage('Username must be at least 5 characters'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters')
],
    async (req: Request, res: Response) => {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()) {
            res.status(400).json({"success": false, errors: validationErrors.array(), message: 'Invalid input'});
            return;
        }

        const { firstname, lastname, username, email, password } = req.body;

        try {
            // check if the user already exists
            
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if(result.rows.length > 0) {
                res.status(400).json({"success": false, message: 'User already exists', error: 'User already exists'});
                return;
            }

            // check if the username already exists
            const usernameResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            if(usernameResult.rows.length > 0) {
                res.status(400).json({"success": false, message: 'Username already exists', error: 'Username already exists'});
                return;
            }
            
            // Hash the password
            const hashedPassword = await hashPasword(password);
            // Time account was created
            const created_at = new Date();
            await pool.query("INSERT INTO users (firstname, lastname, password_hash, email, username, created_at, notification_enabled) VALUES ($1, $2, $3, $4, $5, $6, $7)", [firstname, lastname, hashedPassword, email, username, created_at, false]);

            res.status(201).json({"success": true, message: 'User registered successfully'});
            
        } catch (error) {
    
           if (error instanceof Error) {
               res.status(500).json({"success": false, error: error.message, message: 'Error creating user'});
                return;
           } else {
               res.status(500).json({"success": false, error: 'Unknown error', message: 'Error creating user'});
           }
        }
    }
)

// Setting up the login route
// 1. we validate the input using express-validator. We validate the email to make sure its not empty and that it is a valid email
// We also validate the password to make sure it is not empty and that it is at least 6 characters long
// If there is an error with the validation, we want to send a stuts code of 400 and a message of invalid input and error sets to the validation
// errors array
// 2. We want to check if the email exists n the database, if it doesnt, send to the fronted a status code of 400, the user does not exist
// 3. If the user exists, we want to compare the password with the hashed password using the function i created in the passwordUtils file
// 4. If the password is correct we want to generate a token that we send back to the frontend.

router.post('/login',
    [
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required').isLength({min: 6}).withMessage('Password must be at least 6 characters')
    ],
    async (req: Request, res: Response) => {
        const validateErrors = validationResult(req);
        if(!validateErrors.isEmpty()) {
            res.status(400).json({success: false, message: 'Invalid input',  errors: validateErrors.array()});
            return;
        }

        const {email, password} = req.body;

        try {
            const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
            if(result.rows.length === 0) {
                res.status(400).json({success: false, message: "Email does not exist"})
                return;
            }

            const user = result.rows[0];

            const isPasswordMatch = await comparePassword(password, user.password_hash);
            if(!isPasswordMatch) {
                res.status(400).json({success: false, message: "Password does not match"});
                return;
            }

            // Generate jwt token
            
            const token = generateToken(user.email, user.username);
            res.status(200).json({success: true, message: "User logged in successfully", token: token});

            // Insert last login into database
            await pool.query('UPDATE users SET last_login = $1 WHERE email = $2', [new Date(), email]);
            return;

        } catch (error) {
            if(error instanceof Error) {
                res.status(500).json({success: false, message: "Error logging in user", error: error.message})
            }
        }
    }
)

export default router;