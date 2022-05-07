import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAuth } from "../utils.js";

const orderRouter = express.Router();

orderRouter.post('/', isAuth, expressAsyncHandler(async (req,res) => {
    const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({...x, product: x._id})),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        paymentResults: req.body.paymentResults,
        totalPrice: req.body.totalPrice,
        user: req.user._id
    });
    
    console.log(req.body);
    const order = await newOrder.save();
    res.status(201).send({message: 'New order created', order});
}));

export default orderRouter;