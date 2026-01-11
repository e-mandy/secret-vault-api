import express from 'express';
import User from '../models/User';
import jwt, { sign } from 'jsonwebtoken';

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

        res.status(201).json({
            code: 201,
            message: "User created successfully",
            data: {
                userEmail: newUser.email,
                accessToken
            }
        });
    }catch(error){
        return res.status(400).json({
            code: 500,
            message: error.message
        });
    }
});


authRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Ici on doit prend tout sauf le mot de passe (-password)
    const user = await User.findOne({ email });

    if(!user) return res.status(400).json({
        code: 400,
        message: "Invalid credentials"
    });

    if(!user.comparePassword(password)) return res.status(401).json({
        code: 401,
        message: "Invalid credentials"
    });

    const acces_token = jwt.sign({ userId: user._id }, process.env.SECRET_APP_KEY, { expiresIn: '15m' });

    const refresh_token = jwt.sign({ userId: user._id }, process.env.SECRET_REFRESH_APP, { expiresIn: '7d' });

    res.cookie('refreshToken', refresh_token, {
        httpOnly: true
    });

    return res.status(200).json({
        code: 200,
        message: "User logged successfully",
        data: {
            userEmail: email,
            acces_token
        }
    });
});

authRoutes.post('/logout', async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true
    });

    res.status(200).json({
        code: 200,
        message: "User deconnected successfully"
    })
});

export default authRoutes;