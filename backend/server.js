import express from "express";
import data from "./data.js";

const app = express();

const port = process.env.PORT || 5000;


// Trimitem pe un API
app.get('/api/products', (req,res) => {
    res.send(data.products);
});

// Cautam produsul in DB dupa slug
app.get('/api/products/slug/:slug',(req,res) => {
    const product = data.products.find((x)=> x.slug === req.params.slug);
    if(product) {
        res.send(product);
    } else {
        res.status(404).send({message: 'Produsul nu a fost gasit'});
    }
});


// Cautam produsul in DB dupa id `req.params._id`
app.get('/api/products/:id', (req,res) => {
    const product = data.products.find((x) => x._id === req.params.id);
    if(product){
        res.send(product);
    } else {
        res.status(404).send({message: 'Produsul nu a fost gasit'});
    }
})

app.listen(port, () => {
    console.log(`Server is start in port ${port}`);
});



