import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const bearer_token = req.headers['authorization'];

    if(access_token == undefined && !access_token.startsWith('Bearer ')) return res.status(401).json({
        code: 401,
        message: "You haven't authorize to access to this resources."
    });
    
    const token = bearer_token.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.SECRET_APP_KEY);

        req.user = decoded;

        next();
    }catch(error){
        res.status(403).json({
            code: 403,
            message: error.name
        })
    }
};

export default authenticate;