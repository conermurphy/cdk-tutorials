import * as dotenv from 'dotenv';
import path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export type ConfigProps = {
  REGION: string;
  LAMBDA_ENV: string;
};

export const getConfig = (): ConfigProps => ({
  REGION: process.env.REGION || 'us-east-1',
  LAMBDA_ENV: process.env.LAMBDA_ENV || '',
});
