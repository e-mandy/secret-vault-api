import express from 'express';
import secretRoutes from './routes/secret.routes';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import authenticate from './middlewares/authenticate';

dotenv.config();


const app = express();

app.use('/api/auth', authRoutes);
app.use('/api/secret', authenticate, secretRoutes);