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
exports.getMovieGenres = exports.getMovieDetails = void 0;
const config_1 = __importDefault(require("../Config/config"));
const getMovieDetails = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${config_1.default.tmdbApiKey}`);
    const data = yield response.json();
    return data;
});
exports.getMovieDetails = getMovieDetails;
const getMovieGenres = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, exports.getMovieDetails)(movieId);
    return response.genres;
});
exports.getMovieGenres = getMovieGenres;
