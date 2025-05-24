import express from 'express';
import connectDatabase from './database/db';

const app = express();
const PORT = 5000;

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}.`);
});