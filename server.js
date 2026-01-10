import express from 'express';
import secretRoutes from './routes/secret.routes';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

app.use('/api/secret', authenticate, secretRoutes);