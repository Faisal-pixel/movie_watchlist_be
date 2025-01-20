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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db/db"));
const express_validator_1 = require("express-validator");
const passwordUtils_1 = require("../Utils/passwordUtils");
const generateTokenUtils_1 = require("../Utils/generateTokenUtils");
const router = express_1.default.Router();
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
router.post("/signup", [
    (0, express_validator_1.body)("firstname").notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("lastname").notEmpty().withMessage("Lastname is required"),
    (0, express_validator_1.body)("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 5 characters"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).json({
            success: false,
            errors: validationErrors.array(),
            message: "Invalid input",
        });
        return;
    }
    const { firstname, lastname, username, email, password } = req.body;
    try {
        // check if the user already exists
        const result = yield db_1.default.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        if (result.rows.length > 0) {
            res.status(400).json({
                success: false,
                message: "User already exists",
                error: "User already exists",
            });
            return;
        }
        // check if the username already exists
        const usernameResult = yield db_1.default.query("SELECT * FROM users WHERE username = $1", [username]);
        if (usernameResult.rows.length > 0) {
            res.status(400).json({
                success: false,
                message: "Username already exists",
                error: "Username already exists",
            });
            return;
        }
        // Hash the password
        const hashedPassword = yield (0, passwordUtils_1.hashPasword)(password);
        // Time account was created
        const created_at = new Date();
        yield db_1.default.query("INSERT INTO users (firstname, lastname, password_hash, email, username, created_at, notification_enabled) VALUES ($1, $2, $3, $4, $5, $6, $7)", [
            firstname,
            lastname,
            hashedPassword,
            email,
            username,
            created_at,
            false,
        ]);
        res
            .status(201)
            .json({ success: true, message: "User registered successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                error: error.message,
                message: "Error creating user",
            });
            return;
        }
        else {
            res.status(500).json({
                success: false,
                error: "Unknown error",
                message: "Error creating user",
            });
        }
    }
}));
// Setting up the login route
// 1. we validate the input using express-validator. We validate the email to make sure its not empty and that it is a valid email
// We also validate the password to make sure it is not empty and that it is at least 6 characters long
// If there is an error with the validation, we want to send a stuts code of 400 and a message of invalid input and error sets to the validation
// errors array
// 2. We want to check if the email exists n the database, if it doesnt, send to the fronted a status code of 400, the user does not exist
// 3. If the user exists, we want to compare the password with the hashed password using the function i created in the passwordUtils file
// 4. If the password is correct we want to generate a token that we send back to the frontend.
router.post("/login", [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const validateErrors = (0, express_validator_1.validationResult)(req);
    if (!validateErrors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: "Invalid input",
            errors: validateErrors.array(),
        });
        return;
    }
    const { email, password } = req.body;
    try {
        const result = yield db_1.default.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        if (result.rows.length === 0) {
            res
                .status(400)
                .json({ success: false, message: "Email does not exist" });
            return;
        }
        const user = result.rows[0];
        const isPasswordMatch = yield (0, passwordUtils_1.comparePassword)(password, user.password_hash);
        if (!isPasswordMatch) {
            res
                .status(400)
                .json({ success: false, message: "Password does not match" });
            return;
        }
        // Generate jwt token
        const token = (0, generateTokenUtils_1.generateToken)(user.email, user.username);
        // Insert last login into database
        const rightNow = new Date();
        const today = rightNow.toISOString().split("T")[0];
        yield db_1.default.query("UPDATE users SET last_login = $1 WHERE email = $2", [
            rightNow,
            email,
        ]);
        /** UPDATE STREAKS TABLE */
        const streaks = yield db_1.default.query("SELECT * FROM streaks WHERE user_id = $1", [user.id]);
        const streakData = streaks.rows[0];
        const yesterday = new Date(rightNow);
        yesterday.setDate(rightNow.getDate() - 1);
        const yesterdate = yesterday.toISOString().split("T")[0];
        if (streaks.rows.length === 0) {
            const streak_update_result = yield db_1.default.query("INSERT INTO streaks (user_id, streak_count, start_streak_date, last_streak_update) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING *", [user.id, 1, today, today]);
            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
            });
            return;
        }
        if (((_a = streakData.last_streak_update) === null || _a === void 0 ? void 0 : _a.toISOString().split("T")[0]) === today) {
            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
            });
            return;
        }
        else if (((_b = streakData.last_streak_update) === null || _b === void 0 ? void 0 : _b.toISOString().split("T")[0]) ===
            yesterdate) {
            yield db_1.default.query("UPDATE streaks SET streak_count = $1 WHERE user_id = $2", [streakData.streak_count + 1, user.id]);
            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
            });
            return;
        }
        else {
            // reset the streak to 1
            yield db_1.default.query("UPDATE streaks SET streak_count = $1, start_streak_date = $2, last_streak_update = $3 WHERE user_id = $4", [
                1,
                rightNow.toISOString().split("T")[0],
                rightNow.toISOString().split("T")[0],
                user.id,
            ]);
            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token,
            });
            return;
        }
        console.log(((_c = streakData.last_streak_update) === null || _c === void 0 ? void 0 : _c.toISOString().split("T")[0]) === today);
        console.log(((_d = streakData.last_streak_update) === null || _d === void 0 ? void 0 : _d.toISOString().split("T")[0]) ===
            yesterdate);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: "Error logging in user",
                error: error.message,
            });
        }
    }
}));
exports.default = router;
