"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../Config/config"));
const generateToken = (email, username) => {
    const token = jsonwebtoken_1.default.sign({ email, username }, config_1.default.jwtSecret, { expiresIn: config_1.default.jwtExpiresIn });
    return token;
};
exports.generateToken = generateToken;
