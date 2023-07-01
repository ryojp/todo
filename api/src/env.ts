// NODE_ENV
export const nodeEnv = process.env.NODE_ENV as "production" | "development" | "test";

// MongoDB
export const mongoURL = process.env.MONGODB_URL as string;
export const mongoUser = process.env.MONGODB_USER as string;
export const mongoPass = process.env.MONGODB_PASS as string;
export const mongoDBName = process.env.MONGODB_DBNAME as string;

// JWT
export const jwtSecret = process.env.JWT_SECRET as string;

export const validate = (): boolean => {
  if (!jwtSecret || !mongoURL || !mongoUser || !mongoPass || !mongoDBName) {
    return false;
  }

  return true;
};
