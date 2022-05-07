import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import getError from '../utils';
import LoadingBox from './LoadingBox';
import Messagebox from './MessageBox';
import TooltipInfo from './TooltipInfo';

const reducer = (state,action) => {
    switch(action.type) {
        case 'FETCH_REQUEST': 
            return {...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return {...state, loading: false, order: action.payload, error: ''};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        default: 
            return state;  
    }
}

function OrderDetails() {

    const {state} = useContext(Store);
    const {userInfo} = state;

    const navigate = useNavigate();
    const params = useParams();
    const {id: orderId } = params;

    const [{loading, error, order}, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
        
                const {data} = await axios.get(`/api/orders/${orderId}`, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    }
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data});

            } catch(err){
                dispatch({type: 'FETCH_FAIL', payload: getError(err)});
            }
        }

        if (!userInfo) {
            return navigate('/login');
        }

        if (!order._id || (order._id && order._id !== orderId)) {
            fetchData();
        }

    },[order,userInfo,orderId,navigate]);
    console.log(order);

    return loading ? (<LoadingBox></LoadingBox>) : 
        error ? (<Messagebox variant="danger">{error}</Messagebox>) : 
        (
            <div className='order'>
                <Helmet>
                    <title>Comanda:{orderId}</title>
                </Helmet>
                <h1>Comanda:{orderId}</h1>
                <Row>
                    <Col md={8}>
                        <Card className='mb-4'>
                            <Card.Body>
                                <Card.Title><strong>Date despre livrare</strong></Card.Title>
                                <Card.Text>
                                    <strong>Nume: </strong> {order.shippingAddress.fullname} <br />
                                    <strong>Nr telefon: </strong> {order.shippingAddress.phoneNumber} <br />
                                    <strong>Adresa: </strong> 
                                    {order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.country}
                                </Card.Text>
                                <div>
                                    <strong>Status livrare: </strong>
                                    {order.isDelivered 
                                        ? 
                                        (<Messagebox variant="success">A fost livrat {order.deliveredAt}</Messagebox>) 
                                        : 
                                        (<Messagebox variant="danger">Nu a fost livrat</Messagebox>)
                                    }
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className='mb-4'>
                            <Card.Body>
                                <Card.Title><strong>Date despre metoda de plata</strong></Card.Title>
                                <Card.Text className='mb-2'><strong>Metoda de plata: </strong>{order.paymentMethod}</Card.Text>
                                <div>
                                    <strong>Status achitare: </strong>
                                    {order.isPaid 
                                    ? (<Messagebox variant="success">Achitat</Messagebox>) 
                                    : (<Messagebox variant="danger">Neachitat</Messagebox>)}
                                </div>
                            </Card.Body>
        
                        </Card>
                        <Card>
                            <Card.Body>
                                <Card.Title>Produsele</Card.Title>
                                    {order.orderItems.map((item) => (
                                        <div className='cart__item' key={item._id}>
                                            <div className='thumbnail'>
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className='name'>
                                                <Link to={`/product/${item.slug}`} className='title'>{item.name}</Link>
                                            </div>
                                            <div className='quantity'>{item.quantity}</div>
                                            <div className='price'>
                                                <p>{item.price}$</p>
                                            </div>
                                        </div>
                                    ))}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className='order__sidebar'>
                        <Card.Body>
                            <Card.Title><strong>Comanda acum</strong></Card.Title>
                            <ul className='order__sidebar_nav'>
                                <li>
                                    Cantitatea: <strong>{order.orderItems.reduce((a,c) => a + c.quantity,0)}</strong>
                                </li>
                                <li>
                                    <p className='tooltip__message'>Livrare:
                                        <TooltipInfo message="Livare gratuita la comenzile mai mari de 200 lei."/> 
                                    </p>
                                    <strong>{(order !== 0) ? 0 : 20} lei</strong>
                                </li>
                                <li>
                                    Total: <strong>{order.totalPrice}$</strong>
                                </li>
                            </ul>
                            <Button variant="success">Plaseaza Comanda</Button>
                        </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

export default OrderDetails;
