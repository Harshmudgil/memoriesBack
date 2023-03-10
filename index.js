import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose  from 'mongoose';
import pathRoutes from './routes/posts.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/user',userRoutes);
app.use('/posts', pathRoutes);



const PORT = process.env.PORT;

mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT || 5000, () => console.log(`server is running on Port : http://localhost:${PORT}`)))
    .catch((error) => console.log(error));
