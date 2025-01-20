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
exports.uploadFile = uploadFile;
exports.deleteFile = deleteFile;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../Config/config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinaryName,
    api_key: config_1.default.cloudinaryApiKey,
    api_secret: config_1.default.cloudinaryApiSecret
});
// Function that uploads the file
function uploadFile(fileStr, publicId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // We can create our options that we will pass into the upload method
            const options = {
                resource_type: "image",
                folder: "mw_profile_pictures"
            };
            if (publicId) {
                options["public_id"] = publicId;
            }
            const result = yield cloudinary_1.v2.uploader.upload(fileStr, options);
            return result;
        }
        catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            throw new Error("Cloudinary upload failed");
        }
    });
}
function deleteFile(publicId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield cloudinary_1.v2.uploader.destroy(`mw_profile_pictures/${publicId}`);
        }
        catch (error) {
            console.error("Error deleting file from Cloudinary:", error);
            throw new Error("Cloudinary delete failed");
        }
    });
}
