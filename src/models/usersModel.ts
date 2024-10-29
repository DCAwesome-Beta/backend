import mongoose, { Model } from "mongoose"
import bcrypt from "bcrypt"
import validator from "validator"
import { circleDevSdk } from "../services/devControlledWalletSdk";

const Schema = mongoose.Schema


interface IUser {
    _id: string;
    email: string;
    password: string;
    walletSet: string;
}

interface UserModel extends Model<IUser> {
    signup(
        email: string,
        password: string
    ): Promise<IUser>;
    login(
        email: string,
        password: string
    ): Promise<IUser>;
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
  }
})

// static signup method
userSchema.statics.signup = async function(email: string, password: string) {

  // validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const response = await circleDevSdk.createWalletSet({
    name: email
  })
  const user = await this.create({ email, password: hash, walletSet: response.data?.walletSet })

  return user
}

// static login method
userSchema.statics.login = async function(email: string, password: string) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

export default mongoose.model<IUser, UserModel>('User', userSchema);
