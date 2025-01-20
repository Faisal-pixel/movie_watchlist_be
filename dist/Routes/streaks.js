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
const authMiddleware_1 = require("../middlewares/authMiddleware");
const getUserIdUtils_1 = require("../Utils/getUserIdUtils");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticatToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    try {
        const user = yield (0, getUserIdUtils_1.getUserId)(email, res);
        const { id } = user || {};
        const streaks = yield db_1.default.query("SELECT * FROM streaks WHERE user_id = $1", [id]);
        const streakData = streaks.rows[0];
        const responseData = {
            streak_count: streakData.streak_count,
            start_streak_date: streakData.start_streak_date,
            last_streak_update: streakData.last_streak_update
        };
        res.status(200).json({
            success: true,
            message: "Streaks fetched successfully",
            data: responseData
        });
        return;
    }
    catch (error) {
    }
}));
exports.default = router;
