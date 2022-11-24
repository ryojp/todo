import { Model, Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCK_TIME_MS = 2 * 60 * 60 * 1000; // 2 hr

export interface IUser {
  username: string;
  password: string; // hashed on save
  tasks: Array<Schema.Types.ObjectId>;
  loginAttempts: number;
  lockUntil?: number;
}

export interface IUserDoc extends Document, IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<void>;
  isLocked(): boolean;
  getAuthenticated(password: string): Promise<LoginResult>;
}

export enum LoginResult {
  SUCCESS,
  NOT_FOUND,
  PASSWORD_INCORRECT,
  MAX_ATTEMPTS,
}

interface UserModel extends Model<IUserDoc> {
  getAuthenticated(username: string, password: string): Promise<LoginResult>;
}

const UserSchema = new Schema<IUserDoc, UserModel>({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  lockUntil: Number,
});

UserSchema.method<IUserDoc>(
  "comparePassword",
  async function (candidate_password: string) {
    const match = await bcrypt.compare(candidate_password, this.password);
    return match;
  }
);

UserSchema.method<IUserDoc>(
  "incLoginAttempts",
  async function (): Promise<void> {
    this.loginAttempts++;

    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
      this.lockUntil = Date.now() + LOGIN_LOCK_TIME_MS;
    }

    await this.save();
  }
);

UserSchema.method<IUserDoc>("isLocked", function (): boolean {
  return this.lockUntil! >= Date.now(); // `!` post-fix exp operator
});

UserSchema.method<IUserDoc>(
  "getAuthenticated",
  async function (password: string): Promise<LoginResult> {
    // check if the account is currently locked
    if (this.isLocked()) {
      // just increment login attempts if account is already locked
      await this.incLoginAttempts();
      return LoginResult.MAX_ATTEMPTS;
    }

    // test for a matching password
    const matched = await this.comparePassword(password);

    if (!matched) {
      // password is incorrect, so increment login attempts before responding
      await this.incLoginAttempts();
      return LoginResult.PASSWORD_INCORRECT;
    }

    // if there's no lock or failed attempts, return SUCCESS
    if (!this.loginAttempts && !this.lockUntil) return LoginResult.SUCCESS;

    // reset attempts and lock info
    this.loginAttempts = 0;
    delete this.lockUntil;

    await this.save();

    return LoginResult.SUCCESS;
  }
);

UserSchema.static(
  "getAuthenticated",
  async function (username: string, password: string): Promise<LoginResult> {
    const user = await this.findOne({ username });

    // make sure the user exists
    if (!user) return LoginResult.NOT_FOUND;

    return user.getAuthenticated(password);
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // A new password has been set; let's hash it
  const hashed = await bcrypt.hash(this.password, SALT_ROUNDS);
  this.password = hashed;

  next();
});

const User = model<IUserDoc, UserModel>("User", UserSchema);

export default User;
