import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/router.js';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log('Server is running on port', port);
});