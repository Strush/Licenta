import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import FinishSteps from './FinishSteps';
import { toast } from 'react-toastify';
import getError from '../utils';
import TooltipInfo from './TooltipInfo';
import LoadingBox from './LoadingBox';
import Messagebox from './MessageBox';

const reducer = (state, action) => {
    switch(action.type) {
        case 'ORDER_REQUEST': 
            return {...state, loading: true};
        case 'ORDER_SUCCESS': 
            return {...state, loading: false};
        case 'ORDER_FAIL': 
            return {...state, loading: false};
        default: 
            return state;
    }
}

const Orderscreen = () => {

    // Citesc datele din axaj
    const [{loading, error}, dispatch] = useReducer(reducer,{
        loading: false,
        error: ''
    });

    const navigate = useNavigate();

    // Citim din store.js
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart,userInfo} = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
      );
    const total = (cart.itemsPrice < 200) ?  cart.itemsPrice + 20 : cart.itemsPrice;

    useEffect(() => {
        if(!cart.paymentMethod){
            navigate('/payment')
        }
        if(cart.cartItems.length === 0){
            navigate('/');
        }
    }, [cart,navigate]);

    const orderHandler = async () => {

        try {
            dispatch({type: 'ORDER_REQUEST'});

            const { data } = await axios.post('/api/orders',{
                orderItems: cart.cartItems,
                paymentMethod: cart.paymentMethod,
                shippingAddress: cart.shippingAddress,
                totalPrice: cart.itemsPrice,
                deliveredPrice: (cart.itemsPrice > 200) ? 0 : 20,
            }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`,
                }
            });

            ctxDispatch({type: 'CART_CLEAR'});
            dispatch({type: 'ORDER_SUCCESS'});
            localStorage.removeItem('cartItems');
            navigate(`/order/${data.order._id}`);

        } catch(err) {
            dispatch({type: 'ORDER_FAIL'});
            toast.error(getError(err));
        }
    }

    return (
        loading ? (<LoadingBox />) : 
        error ? (<Messagebox>{error}</Messagebox>) :
        (
<div className='order'>
            <FinishSteps step1 step2 step3 step4 />
            <Helmet>
                <title>Finalizare Comanda</title>
            </Helmet>
            <h1>Finalizare Comanda</h1>
            <Row>
                <Col md={8}>
                    <Card className='mb-4'>
                        <Card.Body>
                            <Card.Title>Date despre livrare</Card.Title>
                            <Card.Text>
                                <strong>Nume: </strong> {cart.shippingAddress.fullname} <br />
                                <strong>Nr telefon: </strong> {cart.shippingAddress.phoneNumber} <br />
                                <strong>Adresa: </strong> 
                                {cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.country}
                            </Card.Text>
                            <Link to="/shipping">Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className='mb-4'>
                        <Card.Body>
                            <Card.Title>Metoda de plata</Card.Title>
                            <Card.Text><strong>Metoda de plata: </strong>{cart.paymentMethod}</Card.Text>
                            <Link to='/payment'>Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Produsele</Card.Title>
                                {cart.cartItems.map((item) => (
                                    <div className='cart__item' key={item._id}>
                                        <div className='thumbnail'>
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className='name'>
                                            <Link to={`/product/${item.slug}`} className='title'>{item.name}</Link>
                                        </div>
                                        <div className='quantity'>{item.quantity}</div>
                                        <div className='price'>
                                            <p>{item.price} lei</p>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/cart">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className='order__sidebar'>
                        <Card.Body>
                            <Card.Title><strong>Comanda acum</strong></Card.Title>
                            <ul className='order__sidebar_nav'>
                                <li>
                                    Cantitatea: <strong>{cart.cartItems.reduce((a,c) => a + c.quantity,0)}</strong>
                                </li>
                                <li>
                                    <p className='tooltip__message'>Livrare:
                                        <TooltipInfo message="Livare gratuita la comenzile mai mari de 200 lei."/> 
                                    </p>
                                    <strong>{(cart.itemsPrice > 200) ? 0 : 20} lei</strong>
                                </li>
                                <li>
                                    Total: <strong>{total.toFixed(2)} lei</strong>
                                </li>
                            </ul>
                            <Button variant="success" onClick={orderHandler} disabled={cart.cartItems.length === 0}>Plaseaza Comanda</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
        )
    );
}

export default Orderscreen;
