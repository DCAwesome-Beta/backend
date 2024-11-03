import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { circleDevSdk } from '../services/devControlledWalletSdk';
import { randomUUID } from 'crypto';

const Schema = mongoose.Schema;

interface IUser {
  _id: string;
  email: string;
  password: string;
  walletSet: string;
  inTokens: string[];
  inMaxTokenCap: number[];
  triggerToken: string;
  outToken: string;
  outChain: string;
}

interface UserModel extends Model<IUser> {
  signup(email: string, password: string): Promise<IUser>;
  login(email: string, password: string): Promise<IUser>;
  setDCAin(email: string, inTokens: string[], inMaxTokenCap: number[], triggerToken: string): Promise<void>;
  setDCAout(email: string, outToken: string, outChain: string): Promise<void>;
}

const userSchema = new Schema<IUser, UserModel>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  walletSet: {
    type: String,
    required: true,
    unique: true
  },
  inTokens: {
    type: [String],
    required: false
  },
  inMaxTokenCap: {
    type: [Number],
    required: false
  },
  triggerToken: {
    type: String,
    required: false
  },
  outToken: {
    type: String,
    required: false
  },
  outChain: {
    type: String,
    required: false
  }
});

// static signup method
userSchema.statics.signup = async function (email: string, password: string) {
  // validation
  if (!email || !password) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  try {
    const response = await circleDevSdk.createWalletSet({
      idempotencyKey: randomUUID(),
      name: email
    });
    await circleDevSdk.createWallets({
      idempotencyKey: randomUUID(),
      walletSetId: response.data?.walletSet.id!,
      count: 1,
      blockchains: ["ETH-SEPOLIA"],
      accountType: "SCA"
    })
    const user = await this.create({
      email,
      password: hash,
      walletSet: response.data?.walletSet.id
    });
  
    return user;

  } catch (error) {
    throw Error('Error creating wallet set');
  }
};

// static login method
userSchema.statics.login = async function (email: string, password: string) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

userSchema.statics.setDCAin = async function (email: string, inTokens: string[], inMaxTokenCap: number[], triggerToken: string) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('User not found');
  }
  user.inTokens = inTokens;
  user.inMaxTokenCap = inMaxTokenCap;
  user.triggerToken = triggerToken;
  await user.save();
};

userSchema.statics.setDCAout = async function (email: string, outToken: string, outChain: string) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('User not found');
  }
  user.outToken = outToken;
  user.outChain = outChain;
  await user.save();
}
  

export default mongoose.model<IUser, UserModel>('User', userSchema);
