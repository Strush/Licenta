import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import path from "path";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();
const port = process.env.PORT || 5000;

// Petru a putea citi din fisierul .env
dotenv.config();

// Ne conectam la DB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Conectat cu success la DB');
}).catch((err) => {
    console.log(err.message)
});

// Seed API (Mongodb)
app.use('/api/seed', seedRouter);

// Convertim metoda post in format JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Trimitem produsele pe un API, din DB
app.use('/api/products',productRouter);

app.use('/api/users',userRouter);
app.use('/api/orders',orderRouter);

// Se transmite PAYPAL_CLIENT_IT in frontent
app.use('/api/keys/paypal',(req,res) => {
    res.send(process.env.PAYPAL_CLINT_ID || 'sb'); // sb => standart sandbox
});

/* */
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/frontend/build')));
// app.get('*', (req,res) => {
//     res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
// });

// ExpressAsyncHandler afisarea erorilor 
app.use((err,req,res,next) => {
    res.status(500).send({message: err.message});
});

app.listen(port, () => {
    console.log(`Server is start in port ${port}`);
});



