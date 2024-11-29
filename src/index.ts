import express from 'express';
import authRoutes from './Routes/auth'

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes


app.use('/auth', authRoutes) // This line tells Express that any requests that start with /auth should be handled by the routes definded in the authRoutes which
// is coming from Routes/auth.ts. You are basically mounting all path in the authRoutes to /auth
// So the final post request api will be POST /auth/signup


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});