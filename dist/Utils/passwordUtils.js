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
exports.comparePassword = exports.hashPasword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// This function takes in a password and returns a hashed password
const hashPasword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    return hashedPassword;
});
exports.hashPasword = hashPasword;
// This function compares a password with a hashed password
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Takes in the password the user entered and the hashed password from the database
    const isMatch = yield bcrypt_1.default.compare(password, hashedPassword);
    return isMatch;
});
exports.comparePassword = comparePassword;
