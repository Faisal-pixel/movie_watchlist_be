"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editWatchlistValidateRequest = void 0;
const express_validator_1 = require("express-validator");
const express_validator_2 = require("../Utils/express-validator");
exports.editWatchlistValidateRequest = [
    (0, express_validator_1.param)("watchlist_id").notEmpty().withMessage("Watchlist ID is required"),
    (0, express_validator_1.body)('watchlist_name').optional().isString().withMessage('Watchlist name must be a string'),
    (0, express_validator_1.body)('description').optional().isString().withMessage('Watchlist description must be a string'),
    express_validator_2.validateErrors
];
