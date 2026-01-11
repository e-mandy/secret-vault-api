import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const authRoutes = express.Router();


authRoutes.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });

        if(user) return res.status(400).json({
            code: 400,
            message: "Invalid credentials"
        });

        const newUser = await User.create({ email, password });

        const accessToken = jwt.sign({ userId: newUser._id }, process.env.SECRET_APP_KEY, { expiresIn: '15m' });

        const refresToken = jwt.sign({ userId: User._id }, process.env.SECRET_REFRESH_APP, { expiresIn: '7d' });

        // NB: Normalement il faut aussi faire une sauvegarde du refresh token en base de données
        res.cookie('refreshToken', refresToken, {
            httpOnly: true,
        });

        res.status(200).json({
            code: 200,
            message: "User created successfully",
            data: {
                userEmail: newUser.email,
                token
            }
        });
    }catch(error){
        return res.status(400).json({
            code: 500,
            message: error.message
        });
    }
});