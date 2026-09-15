import 'dotenv/config'

import app from './src/app.js';
import { connectDB } from './src/db/db.js';

connectDB();

app.listen(3003, () => {
    console.log(`Media service is running on 3003`);
});