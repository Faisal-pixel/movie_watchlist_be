"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// we configure multer to store the files in memory
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const fileUploader = upload.single('profile_picture'); // this will be the name in the form data
exports.default = fileUploader;
