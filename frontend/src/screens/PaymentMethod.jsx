import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import FinishSteps from '../components/FinishSteps'

export default function PaymentMethod() {

    const navigate = useNavigate();
    const {state, dispatch: ctxDispatch} = useContext(Store);

    const {cart: {
        paymentMethod, shippingAddress} 
    } = state;

    useEffect(() => {
        if(!shippingAddress.address){
            navigate('/shipping');
        }
    },[shippingAddress,navigate]);

    const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || 'PayPal');

    const submitHandler = (e) => {
        e.preventDefault();

        ctxDispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName});
        localStorage.setItem('paymentMethod',paymentMethodName);
        navigate('/placeholder');
    }

    return (
        <div className='payment small-container'>
            <Helmet>
                <title>Selectează metoda de plată</title>
            </Helmet>
            <FinishSteps step1 step2 step3 />
            <h1 className='mb-3'>Selectează metoda de plată</h1>
            <Form onSubmit={submitHandler} className="form">
                <Form.Group className='mb-3'>
                    <Form.Check 
                        type="radio"
                        id="PayPal"
                        label="PayPal"
                        value="PayPal"
                        checked={paymentMethodName === 'PayPal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Check 
                        type="radio"
                        id="Cash"
                        label="Cash"
                        value="Cash"
                        checked={paymentMethodName === 'Cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" variant='primary' size='md'>Continuă</Button>
            </Form>
        </div>
    )
}
