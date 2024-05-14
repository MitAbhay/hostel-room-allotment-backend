import express from "express";
import cors from "cors";
import env from 'dotenv';
import mongoConnect from "./db/db.js";
import configs from "./configs/index.js";
import { createServer } from 'http';
import rootIndex from "./routes/index.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const { PORT } = configs;
// env config
env.config();
// app initialization
export const app = express();
// create server
export const server = createServer(app);
// app middleware
app.use(express.json());
app.use(cors());
mongoConnect();

// all routes
app.use("/api/", rootIndex);


const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsPath = join(__dirname, 'modules', 'user', 'uploads');
app.use('/uploads', express.static(uploadsPath));


// listen server
server.listen(PORT, () => {
  console.log(`Hello Boss! I am listening at http://localhost:${PORT}`);
});
