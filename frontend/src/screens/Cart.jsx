import React, { useContext } from 'react'
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash,faPlus,faMinus} from '@fortawesome/free-solid-svg-icons';

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
                        <div className='name text-ellipsis'>
                            <Link to={`/product/${item.slug}`} className='title'>{item.name}</Link>
                        </div>
                        <div className='controls'>
                            <Button variant='flush' className='icon mr-8' 
                                disabled={item.quantity === 1}
                                onClick={() => updateCartHandler (item,item.quantity - 1)}
                            >
                                 <FontAwesomeIcon icon={faMinus} />
                            </Button>
                            <div className='quantity'>{item.quantity}</div>
                            <Button variant='flush' className='icon ml-8' 
                                disabled={item.quantity === item.countInStock}
                                onClick={() => updateCartHandler (item,item.quantity + 1)}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>
                        </div>
                        <div className='price'>
                            <p>{item.price} lei</p>
                        </div>
                        <Button variant='flush' className='icon trash' onClick={() => removeProduct(item)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </div>
                ))}
                </div>
                {}
                <div className='cart__checkout'>
                    <div className='quantity mb-3 mb-sm-4'>
                        Cantitatea: <strong>{cartItems.reduce((a,c) => a + c.quantity, 0)}</strong>
                    </div>
                    <div className='price mb-3 mb-sm-4'>Pretul: 
                        <strong>{cartItems.reduce((a,c) => a + c.price * c.quantity,0)} lei</strong>
                    </div>
                    <Button variant="primary w-100" onClick={checkoutHandler}>Cumpără</Button>
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
