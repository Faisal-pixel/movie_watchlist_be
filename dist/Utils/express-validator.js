"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateErrors = void 0;
const express_validator_1 = require("express-validator");
const validateErrors = (req, res, next) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.log("Validation failed");
        res.status(400).json({ "success": false, errors: validationErrors.array(), message: 'Invalid input' });
        return;
    }
    next();
};
exports.validateErrors = validateErrors;
