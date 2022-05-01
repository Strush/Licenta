import React, { useContext } from 'react'
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import minus from '../images/minus.svg';
import plus from '../images/plus.svg';
import trash from '../images/trash.svg';
import axios from 'axios';
import { Button } from 'react-bootstrap';

export default function Cart() {
    const navigate = useNavigate();
    const {state, dispatch: ctxContext}  = useContext(Store);
    
    const {
        cart: {cartItems},
    } = state;

    const updateCartHandler = async (item, quantity) => {
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

    const removeProduct = (item) => {
        ctxContext({type: 'CART_REMOVE_ITEM', payload: item});
    }

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    }

  return (
    <div className='cart-page'>
        <Helmet>
            <title>Coș</title>
        </Helmet>
        {cartItems.length ? (
            <>
                <div className='cart__body'>
                {cartItems.map((item)=> (
                    <div className='cart__item' key={item._id}>
                        <div className='thumbnail'>
                            <img src={item.image} alt={item.name} />
                        </div>
                        <div className='name'>
                            <Link to={`/product/${item.slug}`} className='title'>{item.name}</Link>
                        </div>
                        <div className='controls'>
                        <button className='icon mr-10' 
                                disabled={item.quantity === 1}
                                onClick={() => updateCartHandler (item,item.quantity - 1)}
                            >
                                <img src={minus} alt="Minus icon" />
                            </button>
                            <div className='quantity'>{item.quantity}</div>
                            <button className='icon ml-10' 
                                disabled={item.quantity === item.countInStock}
                                onClick={() => updateCartHandler (item,item.quantity + 1)}
                            >
                                <img src={plus} alt="Plus icon" />
                            </button>
                        </div>
                        <div className='price'>
                            <p>{item.price}$</p>
                        </div>
                        <div className='icon trash ml-10' onClick={() => removeProduct(item)}>
                            <img src={trash} alt="Trash icon" />
                        </div>
                    </div>
                ))}
                </div>
                {}
                <div className='cart__checkout'>
                    <div className='quantity'>Cantitatea: <strong>{cartItems.reduce((a,c) => a + c.quantity, 0)}</strong></div>
                    <div className='price'>Pretul: <strong>{cartItems.reduce((a,c) => a + c.price * c.quantity,0)}$</strong></div>
                    <Button variant="success" onClick={checkoutHandler}>cumpără</Button>
                </div>
            </>
        ) : (
            <div>
                Cosul este gol, <Link to="/">mergi la cumparaturi</Link>
            </div>
        )}
    </div>
  )
}
