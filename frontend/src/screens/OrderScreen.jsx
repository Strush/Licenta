import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import FinishSteps from '../components/FinishSteps';
import { toast } from 'react-toastify';
import getError from '../utils';
import LoadingBox from '../components/LoadingBox';
import Messagebox from '../components/MessageBox';
import TooltipInfo from '../components/TooltipInfo';

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
        error ? (<Messagebox>{error}</Messagebox>) 
        : (
        <div className='order'>
            <FinishSteps step1 step2 step3 step4 />
            <Helmet>
                <title>Plasează Comanda</title>
            </Helmet>
            <h1 className='mb-3'>Plasează Comanda</h1>
            <Row>
                <Col lg={8} className="mb-4 mb-lg-0">
                    <Card className='mb-3 mb-sm-4'>
                        <Card.Body>
                            <Card.Text>
                                <span className='mb-2 d-block'>
                                    <strong>Nume: </strong> {cart.shippingAddress.fullname}
                                </span>
                                <span className='mb-2 d-block'>
                                    <strong>Nr telefon: </strong> {cart.shippingAddress.phoneNumber}
                                </span>
                                <span className='mb-2 d-block'>
                                    <strong>Adresa:</strong>{cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.country}
                                </span>
                            </Card.Text>
                            <Link to="/shipping">Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className='mb-3 mb-sm-4'>
                        <Card.Body>
                            <Card.Text className='mb-2'><strong>Metoda de plata: </strong>{cart.paymentMethod}</Card.Text>
                            <Link to='/payment'>Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            {cart.cartItems.map((item) => (
                                <div className='cart__item' key={item._id}>
                                    <div className='thumbnail'>
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className='name'>
                                        <Link to={`/product/${item.slug}`} className='title'>{item.name}</Link>
                                    </div>
                                    <div className='quantity'>{item.quantity}</div>
                                    <div className='price'>{item.price} lei</div>
                                </div>
                            ))}
                            <Link to="/cart">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className='order__sidebar'>
                        <Card.Body>
                            <Card.Title className='mb-3'><strong>Comandă acum</strong></Card.Title>
                            <ul className='order__sidebar_nav mb-3'>
                                <li className='mb-2'>
                                    Cantitatea: <strong>{cart.cartItems.reduce((a,c) => a + c.quantity,0)}</strong>
                                </li>
                                <li className='mb-2'>
                                    <p className='tooltip__message'>Livrare:
                                        <TooltipInfo message="Livare gratuită la comenzile mai mari de 200 lei."/> 
                                    </p>
                                    <strong>{(cart.itemsPrice > 200) ? 0 : 20} lei</strong>
                                </li>
                                <li>
                                    Total: <strong>{total.toFixed(2)} lei</strong>
                                </li>
                            </ul>
                            <Button variant="primary w-100" size='md' onClick={orderHandler} disabled={cart.cartItems.length === 0}>Plasează Comanda</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
        )
    );
}

export default Orderscreen;
