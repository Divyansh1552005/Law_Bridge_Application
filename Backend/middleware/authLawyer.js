
import { validateToken } from '../utils/token.js';

// lawyer authentication middleware
const authLawyer = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authorization required. Please provide a valid Bearer token.' 
        });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not Authorized, Login Again' 
        });
    }

    try {
        const decoded = validateToken(token);
        if(!decoded){
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token! Please login again.'
            });
        }
        // Initialize req.body if it doesn't exist
        if (!req.body) {
            req.body = {};
        }

        // Set both lawyerId and user for flexibility
        req.body.lawyerId = decoded.id;
        req.lawyer = decoded;

        next();
    } catch (error) {
        console.log('Token verification error:', error);
        // console.log('JWT_SECRET used:', process.env.JWT_SECRET);
        res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token! Please login again.',
            error: error.message
        });
    }
}

export default authLawyer;