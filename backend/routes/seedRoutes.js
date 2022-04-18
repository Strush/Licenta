import express from "express";
import data from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModal.js";

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(data.products);

    await User.deleteMany({});
    const users = await User.insertMany(data.users);
    
    res.send({createdProducts,users});

});

export default seedRouter;