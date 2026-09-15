import 'dotenv/config';

import app from './src/app.js';

app.listen( 8000, () => {
    console.log(`API Gateway is running on 8000`);
});