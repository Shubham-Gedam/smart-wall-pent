import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js'
import { connectDB } from './src/db/db.js';


connectDB()



app.listen('3000',()=>{
    console.log("Auth server is running on 3000");
})