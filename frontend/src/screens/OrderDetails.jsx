import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Store } from '../Store';
import getError from '../utils';
import LoadingBox from '../components/LoadingBox';
import Messagebox from '../components/MessageBox';
import TooltipInfo from '../components/TooltipInfo';
import { toast } from 'react-toastify';

const reducer = (state,action) => {
    switch(action.type) {
        case 'FETCH_REQUEST': 
            return {...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return {...state, loading: false, order: action.payload, error: ''};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};

        case 'PAY_REQUEST':
            return {...state, loadingPay: true}
        case 'PAY_SUCCESS':
            return {...state, loadingPay: false, successPay: true}
        case 'PAY_FAIL': 
            return {...state, loadingPay: false}
        case 'PAY_RESET':
            return {...state, loadingPay: false, successPay: false}
        
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

    // isPending default este false
    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    const [{loading, error, order,successPay,loadingPay}, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        successPay: false,
        loadingPay: false,
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

        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            fetchData();
            if(successPay){
                dispatch({type: 'PAY_RESET'});
            }
        } else {
            const paidOrder = async () => {

                // Se citeste PAYPAL_CLIEND_ID din backend
                const {data: clientId} = await axios.get('/api/keys/paypal', {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                });

                // Se reseteaza optiunile default pentru paypal
                if(clientId){
                    paypalDispatch({
                        type: 'resetOptions', 
                        value: {
                            'client-id': clientId,
                            'currency': 'USD'
                        }
                    });

                    paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
                } else {
                    toast.error('Nu exsita asa cliet ID in paypal');
                }
            }

            paidOrder();
        }

    },[order,userInfo,orderId,navigate,paypalDispatch,successPay]);

    const createOrder = (data,actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {value: order.totalPrice}
                }
            ],
        }).then((orderId) => {
            return orderId;
        });
    }

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details){
            try {
                dispatch({type: 'PAY_REQUEST'});
                const {data} = await axios.put(`/api/orders/${orderId}/pay`, details, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                });
                dispatch({type: 'PAY_SUCCESS', payload: data});
                toast.success('Comanda a fost platita cu success!');
            } catch (err){
                dispatch({type: 'PAY_FAIL', payload: getError(err)})
                toast.error(getError(err));
            }
        });
    }
    const onError = (err) => {
        toast.error(getError(err));
    }

    return loading ? (<LoadingBox />) : 
        error ? (<Messagebox variant="danger">{error}</Messagebox>) : 
        (
            <div className='order order--details'>
                <Helmet>
                    <title>Comanda:{orderId}</title>
                </Helmet>
                <h1 className='mb-3'>Comanda:{orderId}</h1>
                <Row>
                    <Col lg={8} className="mb-4 mb-lg-0">
                        <Card className='mb-3 mb-sm-4'>
                            <Card.Body>
                                <Card.Text>
                                <span className='mb-2 d-block'>
                                    <strong>Nume: </strong> {order.shippingAddress.fullname}
                                </span>
                                <span className='mb-2 d-block'>
                                    <strong>Nr telefon: </strong> {order.shippingAddress.phoneNumber}
                                </span>
                                <span className='mb-2 d-block'>
                                    <strong>Adresa:</strong>{order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.country}
                                </span>
                                </Card.Text>
                                {order.isDelivered 
                                    ? 
                                    (<Messagebox variant="success">A fost livrat {order.deliveredAt}</Messagebox>) 
                                    : 
                                    (<Messagebox variant="danger">Nu a fost livrat</Messagebox>)
                                }
                            </Card.Body>
                        </Card>
                        <Card className='mb-3 mb-sm-4'>
                            <Card.Body>
                                <Card.Text className='mb-2'><strong>Metoda de plata: </strong>{order.paymentMethod}</Card.Text>
                                    {order.isPaid 
                                    ? (<Messagebox variant="success">Achitat: {order.paidAt}</Messagebox>) 
                                    : (<Messagebox variant="danger">Neachitat</Messagebox>)
                                    }
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
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
                                            <p>{item.price} lei</p>
                                        </div>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card className='order__sidebar'>
                        <Card.Body>
                            <Card.Title className='mb-2'><strong>Comandă acum</strong></Card.Title>
                            <ul className='order__sidebar_nav'>
                                <li className='mb-2'>
                                    <p className='d-flex justify-content-between w-100'>Cantitatea: <strong>{order.orderItems.reduce((a,c) => a + c.quantity,0)}</strong></p>
                                </li>
                                <li className='mb-2'>
                                    <p className='tooltip__message'>Livrare:
                                        <TooltipInfo message="Livare gratuita la comenzile mai mari de 200 lei."/> 
                                    </p>
                                    <strong>{(order !== 0) ? 0 : 20} lei</strong>
                                </li>
                                <li className='mb-3'>
                                    <p className='d-flex justify-content-between w-100'>Total: <strong>{order.totalPrice} lei </strong></p>
                                </li>
                            </ul>
                            {!order.isPaid && (
                                <div className='position-relative'>
   
                                    {isPending ? (<LoadingBox/>) : (
                                    <div>
                                        <PayPalButtons 
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        />
                                    </div>
                                    )}
                                    {loadingPay && <LoadingBox />}
                                </div>
                            )}
                        </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

export default OrderDetails;
