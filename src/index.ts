import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`);
});