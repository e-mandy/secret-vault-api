import express from 'express';
import Secret from '../models/Secret';
import crypto from 'crypto';


const secretRoutes = express.Router();
const key = crypto.scryptSync(process.env.CIPHER_SECRET_KEY, 'salt', 32);

secretRoutes.post('/secrets', async (req, res) => {
    const { title, content } = req.body;
    const id = req.user.userId;

    try{

        const iv = crypto.randomBytes(16);

        // On initialise le moteur de chiffrement
        const cipher = crypto.createCipheriv(process.env.CIPHER_ALGORITHM, key, iv);
        // On transforme de utf8 à hex
        let encrypted = cipher.update(content, 'utf8', 'hex');
        // On termine en ajoutant du padding
        encrypted += cipher.final('hex');

        const new_secret = await Secret.create({ id, title, encrypted, iv: iv.toString('hex') });
    
        return res.status(200).json({
            code: 200,
            message: "Secret ajouté avec succès"
        });

    }catch(error){
        return res.status(400).json({
            code: 400,
            message: error.message
        });
    }
});

secretRoutes.get('/secrets:secretId', async (req, res) => {
    const id = req.user.userId;

    try{

        const secrets = await Secret.findAll({ id: userId });
    
        const secrets_decrypted = secrets.map(encrypted => {
            const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGORITHM, process.env.CIPHER_SECRET_KEY, Buffer.from(encrypted.iv, 'hex'));
            let decrypted = decipher.update(encrypted.encryptedContent, 'hex', 'utf-8');
            decrypted += decipher.final('utf-8');
    
            return {
                title: encrypted.title,
                content: decrypted,
                createdAt: encrypted.createdAt
            }
        });
    
        return res.status(200).json({
            code: 200,
            secrets: secrets_decrypted
        });

    }catch(error){
        res.status(400).json({
            code: 400,
            message: "Lecture des messages impossible"
        })
    }
    
});

export default secretRoutes;