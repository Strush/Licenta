import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRouter.js";

const app = express();
const port = process.env.PORT || 5000;

// Petru a putea citi din fisierul .env
dotenv.config();

// Ne conectam la DB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Conectat cu success la DB');
}).catch((err) => {
    console.log(err.message)
})

// Seed API (Mongodb)
app.use('/api/seed', seedRouter);

// Trimitem produsele pe un API, din DB
app.use('/api/products',productRouter);

app.listen(port, () => {
    console.log(`Server is start in port ${port}`);
});



