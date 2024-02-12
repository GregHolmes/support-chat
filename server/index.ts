import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { routes } from './src/routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('trust proxy', true)

app.use(routes())

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});