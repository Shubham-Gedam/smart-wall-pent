import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/db/db.js';

connectDB();

app.listen( 3001, () => {
    console.log(`Project service is running on 3001`);
});