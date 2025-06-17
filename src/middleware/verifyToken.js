const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
    try {
        // محاولة الحصول على الـ token من Authorization header أولاً
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        // إذا لم يوجد في header، جربه من cookies
        if(!token) {
            const cookieToken = req.cookies.token;
            if(!cookieToken) {
                return res.status(401).send({message: 'No token provided'});
            }
            req.token = cookieToken;
        } else {
            req.token = token;
        }

        const decoded = jwt.verify(req.token, JWT_SECRET);
        if(!decoded){
            return res.status(401).send({message: 'Invalid token or not valid'})
        }
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.error('Error while verifying token', error);
        res.status(401).send({message: 'Error while verifying token'})
    }
}

module.exports = verifyToken;