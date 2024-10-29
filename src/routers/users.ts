import express from 'express';
import { loginUser, signupUser } from '../controllers';
import { loginSchema, validate, signupSchema } from '../middleware';

const users = express.Router();

users.post('/signup', validate(signupSchema), signupUser);

users.post('/signin', validate(loginSchema), loginUser);

export { users };
