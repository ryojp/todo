import { Algorithm, SignOptions, VerifyOptions } from "jsonwebtoken";
import { nodeEnv } from "../env";

// JWT Sign options
export const signOptions: SignOptions = {
  algorithm: "HS256",
  expiresIn: "10s",
  issuer: `github.com/ryojp/todo:${nodeEnv}`,
};

// JWT Verify options
export const verifyOptions: VerifyOptions = {
  algorithms: [signOptions.algorithm] as Algorithm[],
  issuer: signOptions.issuer,
};
