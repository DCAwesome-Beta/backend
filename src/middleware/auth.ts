import { NextFunction, Request, Response } from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.sendStatus(403);
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    try {

        const {_id, payload} = jwt.verify(bearerToken, process.env.SECRET || "") as { _id: string, payload: JwtPayload }
        if (payload.exp) {
            if (Date.now() > payload.exp * 1000) {
                return res.sendStatus(403);
            }
        } else {
            return res.sendStatus(403);
        }
        
        req.headers.token = _id;
    } catch (error) {
        console.log(error)
        res.status(401).json({error: "Request is not authorized"})
    }


  next();
};
