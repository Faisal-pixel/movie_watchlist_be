"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../Config/config"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movie_watchlist_app',
    password: config_1.default.dbPassword,
    port: 5432
});
exports.default = pool;
