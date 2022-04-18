import express from "express";
import Product from "../models/productModel.js";

const productRouter = express.Router();

productRouter.get('/', async (req,res) => {
    const products = await Product.find();
    res.send(products);
});

// Cautam produsul in DB dupa slug
productRouter.get('/slug/:slug', async (req,res) => {
    const product = await Product.findOne({slug: req.params.slug});
    if(product) {
        res.send(product);
    } else {
        res.status(404).send({message: 'Produsul nu a fost gasit'});
    }
});

// Cautam produsul in DB dupa id `req.params._id`
productRouter.get('/:id', async (req,res) => {
    const product = await Product.findById(req.params.id);
    if(product){
        res.send(product);
    } else {
        res.status(404).send({message: 'Produsul nu a fost gasit'});
    }
})

export default productRouter;