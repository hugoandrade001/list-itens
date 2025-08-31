import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express'
import { unathorizedException } from '../cores/errors'
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
            }
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new unathorizedException('Access Token required')
        }
        const token = authHeader.substring(7)

        const decoded = jwt.verify(token, 'your-secret-key') as any

        req.user = {
            userId: decoded.userId,
            email: decoded.email
        }

        next()
    } catch (error: any) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            })
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            })
        }

        return res.status(401).json({
            success: false,
            message: error.message || 'Authentication failed'
        })
    
    }
}