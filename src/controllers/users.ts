import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/usersModel';

const createToken = (_id: string) => {
  return jwt.sign({ _id }, process.env.SECRET || '', { expiresIn: '3d' });
};

// login a user
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token, inTokens: user.inTokens, inMaxTokenCap: user.inMaxTokenCap, triggerToken: user.triggerToken, outToken: user.outToken, outChain: user.outChain });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    next(error);
  }
};

// signup a user
const signupUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    next(error);
  }
};

const setDCAin = async (req: Request, res: Response, next: NextFunction) => {
  const { inTokens, inMaxTokenCap, triggerToken } = req.body
  
  const user = await User.findById(req.headers.user);
  if (!user) {
    res.status(401).json({ error: 'Request is not authorized' });
    return;
  }
  try {
    await User.setDCAin(user.email, inTokens, inMaxTokenCap, triggerToken);

    res.status(200).json({ data: "DCAin Strategy Created Successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    next(error);
  }
};

const setDCAout = async (req: Request, res: Response, next: NextFunction) => {
  const { outToken, outChain } = req.body

  const user = await User.findById(req.headers.user);
  if (!user) {
    res.status(401).json({ error: 'Request is not authorized' });
    return;
  }
  try {
    await User.setDCAout(user.email, outToken, outChain);

    res.status(200).json({ data: "DCAout Strategy Created Successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    next(error);
  }
}
export { signupUser, loginUser, setDCAin, setDCAout };
