import express from 'express';
import { loginUser, setDCAin, setDCAout, signupUser } from '../controllers';
import { loginSchema, validate, signupSchema, authMiddleware, setDCAinSchema, setDCAoutSchema } from '../middleware';

const users = express.Router();
const authUsers = express.Router();

authUsers.use(authMiddleware);

users.post('/signup', validate(signupSchema), signupUser);

users.post('/signin', validate(loginSchema), loginUser);

authUsers.post('/setDCAin', validate(setDCAinSchema), setDCAin);

authUsers.post('/setDCAout', validate(setDCAoutSchema), setDCAout);

export { users, authUsers };
