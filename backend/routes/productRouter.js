import express from "express";
import Product from "../models/productModel.js";
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth } from "../utils.js";

const productRouter = express.Router();

productRouter.get('/', async (req,res) => {
    const products = await Product.find();
    res.send(products);
});

productRouter.post('/',
    isAuth, 
    isAdmin, expressAsyncHandler( async (req,res) => {
    const newProduct = new Product({
        name: 'demo' + Date.now(),
        slug: 'demo-slug' + Date.now(),
        image: 'no image',
        brand: 'demo',
        category: 'demo',
        description: 'demo descriere',
        price: 0,
        countInStock: 0,
        rating: 0,
        numReviews: 0,
    });
    const product = await newProduct.save()
    res.send({message: 'Produsul a fost creat cu succes', product});
}));

productRouter.put('/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req,res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if(product){
            product.name = req.body.name;
            product.slug = req.body.slug;
            product.image = req.body.image;
            product.price = req.body.price;
            product.brand = req.body.brand;
            product.category = req.body.category;
            product.description = req.body.description;
            product.countInStock = req.body.countInStock;
            product.rating = req.body.rating;
            product.numReviews = req.body.numReviews;
            await product.save();
            res.send({message: 'Produsul a fsot modificat cu succes'})
        } else {
            res.status(404).send({message: 'Produsul nu exista!'})
        }
    })
)

productRouter.delete('/:id', 
    isAuth, 
    isAdmin,
    expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product){
        await product.remove();
        res.send({message: 'Produsul a fost sters cu succes'});
    } else {
        res.status(404).send({message: 'Produsul nu a fost gasit'});
    }

}))

// Search
productRouter.get('/search', expressAsyncHandler(async (req,res) => {
    const {query} = req;
    const pageSize = query.pageSize || 3;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';
    
    const queryFilter = 
        searchQuery && searchQuery !== 'all'
        ? {
            name: {
                $regex: searchQuery,
                $options: 'i',
            },
        } 
        : 
        {}
    ;

    const categoryFilter = category && category !== 'all' ? {category} : {};
    const ratingFilter = 
        rating && rating !== 'all'
        ? {
            rating: {
                $gte: Number(rating)
            }
        } 
        : 
        {}
    ;

    const priceFiler = 
        price && price !== 'all'
        ? {
            price: {
                $gte: Number(price.split('-')[0]),
                $lte: Number(price.split('-')[1]),
            },
        } 
        : 
        {}
    ;

    const sortOrder = 
        order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? {price : 1}
        : order === 'highest' 
        ? {price: -1}
        : order === 'toprated'
        ? {rating: -1}
        : order === 'newest'
        ? {createdAt: -1}
        : {_id: -1}

    const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFiler,
        ...ratingFilter,
    }).sort(sortOrder)
      .skip(pageSize * (page -1))
      .limit(pageSize);

      const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFiler,
        ...ratingFilter,
      });

      res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      });

}))

productRouter.get('/categories', expressAsyncHandler(async (req,res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);

}));

productRouter.get('/admin', 
    isAuth, 
    isAdmin, 
    expressAsyncHandler(async (req,res) => {
        const {query} = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || 3;

        const products = await 
            Product.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        const countProducts = await Product.countDocuments();
        res.send({
            products,
            page,
            countProducts,
            pages: Math.ceil(countProducts / pageSize),
        });
}));

// Cautam produsul in DB dupa slug
productRouter.get('/slug/:slug', async (req,res) => {
    const product = await Product.findOne({slug: req.params.slug});
    if(product) {
        res.send(product);
    } else {
        res.status(404).send({message: 'Produsul nu a fost gasit'});
    }
});

// Cautam produsul in DB dupa id
productRouter.get('/:id', async (req,res) => {
    const product = await Product.findById(req.params.id);
    if(product){
        res.send(product);
    } else {
        res.status(404).send({message: 'Produsul nu a fost gasit'});
    }
})

export default productRouter;