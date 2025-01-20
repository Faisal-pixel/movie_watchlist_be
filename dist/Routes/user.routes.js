"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const getUserIdUtils_1 = require("../Utils/getUserIdUtils");
const db_1 = __importDefault(require("../db/db"));
const multerMiddleware_1 = __importDefault(require("../middlewares/multerMiddleware"));
const profileUploadMiddleware_1 = require("../middlewares/profileUploadMiddleware");
const uuid_1 = require("uuid");
// This route will containing all route partaining to a user
const router = (0, express_1.Router)();
// get user route /user
// 1. We get the user's information from the jwt token and then we extract the user id from there.
// 2. We then use the user id to get the user's information from the backend
// Base checks
// 1. If the id does not exist in the backend, then the user does not exist
router.get('/get-current-user', authMiddleware_1.authenticatToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    try {
        const user = yield (0, getUserIdUtils_1.getUserId)(email, res);
        const { id } = user || {};
        const result = yield db_1.default.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(400).json({ "success": false, "message": "User does not exist" });
            return;
        }
        const userResult = result.rows[0];
        const userResponse = {
            id: userResult.id,
            username: userResult.username,
            firstname: userResult.firstname,
            lastname: userResult.lastname,
            profile_picture: userResult.profile_picture,
            email: userResult.email,
            created_at: userResult.created_at,
            last_login: userResult.last_login,
            bio: userResult.bio,
            notification_enabled: userResult.notification_enabled
        };
        res.status(200).json({ "success": true, "message": "User found", "data": userResponse });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "success": false, "message": "Error getting user", "error": error.message });
            return;
        }
    }
}));
// UPDATE USER PROFILE /user/update-profile
// We first pass through the authenticatToken middleware, which gives helps convert the token to the user details and then stores it in the
// req.user object.
// We want to ensure that something is being passed from the frontend, so we can use express validator for that
// We want to ensure that the user exists in the database, so we can use the getUserId function to get the user id.
// If there is no id, then the user does not exist
// If there is then we go ahead with file uploading.
// STEP 1: Handling File upload
// STEP 2: Storing the image
// STEP 3: Saving the file reference in the database
// Before we do any upload, we want to confirm that the person is authenticated
// And also confirm that the user exists
const validateRequest = [
    (0, express_validator_1.body)('firstname').optional().isString().withMessage('First Name must be a string'),
    (0, express_validator_1.body)('lastname').optional().isString().withMessage('Last name must be a string'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('profile_picture').optional(), // Profile picture is handled by multer
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ "success": false, errors: errors.array(), message: 'Invalid input' });
            return;
        }
        next();
    },
];
router.patch('/update-profile', authMiddleware_1.authenticatToken, validateRequest, multerMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.user; // THis email is gotten from the jwt token
    const { firstname, lastname, email: newEmail } = req.body; // This is gotten from the request body
    try {
        const user = yield (0, getUserIdUtils_1.getUserId)(email, res);
        const { id, profile_picture } = user || {};
        // Handling file upload
        const file = req.file;
        //Check for when there are no fields to update
        if (!firstname && !lastname && !newEmail && !file) {
            res.status(400).json({ "success": false, message: "No fields were provided for update" });
            return;
        }
        if (file) {
            const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`; // THis generates a data uri for the image
            // Upload file to cloudinary
            const uniquePublicId = `user_${id}_${(0, uuid_1.v4)()}`; // user_the-id-of-the-current-user_random-uuid
            // We need to first check if there is a profile picture attached to the current user
            // If there is, we want to delete it from cloudinary first
            if (profile_picture) {
                const oldPublicId = (_a = profile_picture.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                if (oldPublicId) {
                    yield (0, profileUploadMiddleware_1.deleteFile)(oldPublicId);
                }
            }
            // UPLOAD NEW PROFILE PICTURE
            const result = yield (0, profileUploadMiddleware_1.uploadFile)(fileStr, uniquePublicId);
            if (!result) {
                res.status(500).json({ "success": false, "message": "Error uploading profile picture" });
                return;
            }
            if (result) {
                yield db_1.default.query('UPDATE users SET profile_picture = $1 WHERE id = $2', [result.url, id]);
            }
        }
        // Update user details
        if (firstname || lastname || newEmail) {
            yield db_1.default.query('UPDATE users SET firstname = COALESCE($1, firstname), lastname = COALESCE($2, lastname), email = COALESCE($3, email) WHERE id = $4', [firstname, lastname, newEmail, id]);
        }
        res.status(200).json({ "success": true, "message": "User updated successfully" });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "success": false, "message": "Error updating user", "error": error.message });
            return;
        }
    }
}));
exports.default = router;
