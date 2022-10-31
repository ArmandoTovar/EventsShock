import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const APOLLO_PORT = process.env.PORT || 4000;

export const API_PORT = process.env.API_PORT || 5000;

export const JWT_SECRET = process.env.JWT_SECRET;

export const ACCESS_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7;
