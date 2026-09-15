import 'dotenv/config';

import app from './src/app.js';
import { connectDB } from './src/db/db.js';

connectDB();

app.listen(3004, () => {
    console.log(`Analytics service is running on 3004`);
});