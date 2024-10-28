import express from 'express';
import {
    loginUser,
    signupUser
} from '../controllers';
import {
    validate,
} from '../middleware';
import { signupSchema } from '../middleware/types/schemas';

const users = express.Router();

users.post('/signup', validate(signupSchema), signupUser);

users.post('/login', validate(loginUser), loginUser);

export { users };