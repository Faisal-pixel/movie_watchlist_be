import jwt from 'jsonwebtoken';
import config from '../Config/config';
import { NextFunction, Request, Response } from 'express';
import { IRequest } from 'src/types/reques.type';

// Export a function called authenticatToken. This function basically sits in the middle of a request and authorizes the token before
// the request is processed

// 2. We get the authHeader from the request headers. The token is sent through the headers of the backend.
// Scenario, when a user request something form the backend (could be user login in, or a user that is logged in trying to access an information
// on the backend, the token is sent through the headers of the request)

// 3. We need to check if the token actually exists, if it doesnt we send a status of 401

// 4. if there is one, then we create a try catch block.
// We verify the token  by calling jwt.verify, we pass in the token and then we pass in the config.jwtSecret that we created.
// Then we set the req.user to the user that is gotten from the jwt.verify function.
// and then we call the next function to allow express to move on to the next middle ware or the route handler.
export const authenticatToken = (req: IRequest, res: Response, next: NextFunction) => {
    // Getting the header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];	// This means if the authHeader exists on the request, then split the
    // auth header by space and take the second element.
    if(!token) {
        res.status(401).json({message: 'Access Denied'});
        return;
    };

    // There is a token, verify user

    try {
        if(!config.jwtSecret) {
            throw new Error('No JWT secret provided');
        }
        const user = jwt.verify(token, config.jwtSecret);
        
        req.user = user; // Attach user info to request
        next();
    } catch (error) {
        res.status(403).json({message: 'Invalid token!'});
        return;
    }
}