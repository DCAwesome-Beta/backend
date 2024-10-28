import { NextFunction, Request, Response } from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        res.sendStatus(403);
        return;
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    try {

        const {_id, payload} = jwt.verify(bearerToken, process.env.SECRET || "") as { _id: string, payload: JwtPayload }
         if (payload.exp && Date.now() > payload.exp * 1000) {
            res.sendStatus(403);
            return;
        }
        
        req.headers.token = _id;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({error: "Request is not authorized"})
    }

};
