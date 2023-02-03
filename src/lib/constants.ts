import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.OPENDOTA_ENDPOINT || 
    !process.env.STRATZ_ENDPOINT || 
    !process.env.STRATZ_TOKEN || 
    !process.env.MONGODB_URI
) {
  throw new Error(`Please add missing environment variables to the .env`);
}

const constants = {
  opendota_endpoint: process.env.OPENDOTA_ENDPOINT,
  stratz_endpoint: process.env.STRATZ_ENDPOINT,
  stratz_token: process.env.STRATZ_TOKEN,
  mongodb_uri: process.env.MONGODB_URI,
}

export default constants;