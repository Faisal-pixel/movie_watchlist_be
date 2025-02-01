import express from 'express';
import authRoutes from './Routes/auth';
import watchlistRoutes from './Routes/watchlistRoutes';
import userRoutes from './Routes/user.routes';
import streaksRoutes from './Routes/streaks';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes


app.use('/auth', authRoutes) // This line tells Express that any requests that start with /auth should be handled by the routes definded in the authRoutes which
// is coming from Routes/auth.ts. You are basically mounting all path in the authRoutes to /auth
// So the final post request api will be POST /auth/signup

app.use('/watchlist', watchlistRoutes);

app.use('/user', userRoutes);

app.use('/streaks', streaksRoutes);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});