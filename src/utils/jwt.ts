import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'supersecretjwtkey';
const JWT_EXPIRES_IN: number = Number(process.env.JWT_EXPIRES_IN) || 3600;

export const generateToken = (payload: object): string => {
  const options: SignOptions = { 
    expiresIn: JWT_EXPIRES_IN 
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): string | object => {
  return jwt.verify(token, JWT_SECRET);
};