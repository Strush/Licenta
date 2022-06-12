import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModal.js";
import Product from "../models/productModel.js";
import { isAdmin, isAuth } from "../utils.js";

const orderRouter = express.Router();

orderRouter.post('/', isAuth, expressAsyncHandler(async (req,res) => {
    const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({...x, product: x._id})),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        paymentResults: req.body.paymentResults,
        totalPrice: req.body.totalPrice,
        deliveredPrice: req.body.deliveredPrice,
        user: req.user._id
    });
    
    const order = await newOrder.save();
    res.status(201).send({message: 'New order created', order});
}));

orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req,res) => {
    const orders = await Order.find({user: req.user._id});
    res.send(orders);
}));

orderRouter.get('/summary',
    isAuth, 
    isAdmin, 
    expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                numOrders: {$sum: 1},
                totalSales: {$sum: '$totalPrice'}
            }
        }
    ]);

    const users = await User.aggregate([
        {
            $group: {
                _id: null,
                numUsers: {$sum: 1}
            }
        }
    ]);

    const dailyOrders = await Order.aggregate([
        {
            $group: {
                _id: {$dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
                orders: {$sum: 1},
                sales: {$sum: '$totalPrice'}
            }
        },
        { $sort: { _id: 1 } },
    ]);

    const productCategories = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                count: {$sum: 1}
            }
        },
    ]);

    res.send({orders, users,dailyOrders, productCategories});
}));

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);
    if(order){
        res.send(order);
    } else {
        res.status(404).send({message: 'Order not found'});
    }
}));

orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isPaid = true,
        order.paidAt = Date.now(),
        order.paymentResults = {
            id: req.body.id,  
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        }

        const updateOrder = await order.save();
        res.send({message: 'Comanda platita', order: updateOrder});
    } else {
        res.status(404).send({message: 'Comanda nu exista'});
    }
}))

export default orderRouter;