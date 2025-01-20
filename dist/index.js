"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./Routes/auth"));
const watchlistRoutes_1 = __importDefault(require("./Routes/watchlistRoutes"));
const user_routes_1 = __importDefault(require("./Routes/user.routes"));
const streaks_1 = __importDefault(require("./Routes/streaks"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/auth', auth_1.default); // This line tells Express that any requests that start with /auth should be handled by the routes definded in the authRoutes which
// is coming from Routes/auth.ts. You are basically mounting all path in the authRoutes to /auth
// So the final post request api will be POST /auth/signup
app.use('/watchlist', watchlistRoutes_1.default);
app.use('/user', user_routes_1.default);
app.use('/streaks', streaks_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
