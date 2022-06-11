import axios from 'axios';
import React, { useContext } from 'react'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

export default function Product(props) {
    const {product} = props;

    const addToCart = async (item) => {
        const existProduct = cartItems.find((x) => x._id === item._id);
        const quantity = existProduct ? existProduct.quantity + 1 : 1;

        const {data} = await axios.get(`/api/products/${item._id}`);
        if(data.countInStock < quantity){
            window.alert('Produsul nu mai este in stock');
            return;
        }
        ctxContext({
            type: 'CART_ADD_ITEM',
            payload: {...item, quantity}
        })

    }

    const {state, dispatch: ctxContext}  = useContext(Store);
    const {cart: {cartItems}} = state;

  return (
    <div className="product">
        <Link to={`product/${product.slug}`} className="thumbnail">
            <img className='product__img' src={product.image} alt={product.slug} />
        </Link>
        <div className="content">
            <Link to={`/product/${product.slug}`} className="name">
                <p>{product.name}</p>
            </Link>
            <p className="price"><strong>{product.price} lei</strong></p>
            {(product.countInStock > 0) ? (<Button variant="primary" className="w-100" onClick={() => addToCart(product)}>           
                Adaugă în Coș</Button>
            ) : (
                <Button variant="danger" className="w-100" >Stock Epuizat</Button>
            ) }
        </div>
    </div>
  )
}
