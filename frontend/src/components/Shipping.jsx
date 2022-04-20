import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import FinishSteps from './FinishSteps';

export default function Shipping() {
    const navigate = useNavigate();
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        userInfo,
        cart: { shippingAddress },
      } = state;

    const [fullname, setFullName] = useState(shippingAddress.fullname || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalcode, setPostalCode] = useState(shippingAddress.postalcode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    useEffect(() => {
        if(!userInfo){
            navigate('/signin?redirect=/shipping');
        }
    },[userInfo,navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        
        ctxDispatch({type: 'SAVE_SHIPPING_ADDRESS', payload: {
            fullname,
            address,
            city,
            postalcode,
            country
        }});

        localStorage.setItem('shippingAddress',JSON.stringify({
            fullname,
            address,
            city,
            postalcode,
            country
        }));
        navigate('/payment');
    }

    return (
    <div className='small-container'>
        <Helmet>
            <title>Addresa de livrare</title>
        </Helmet>
        <FinishSteps step1 step2 />
        <h1 className='mb-4'>Addresa de livrare</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="fullname">
                <Form.Label>Nume complet</Form.Label>
                <Form.Control 
                    type="text" 
                    value={fullname} 
                    placeholder="Nume complet" 
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
                <Form.Label>Addresa</Form.Label>
                <Form.Control 
                    type="text" 
                    value={address} 
                    placeholder="Addresa" 
                    onChange={(e) => setAddress(e.target.value)}
                    required 
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="postalcode">
                <Form.Label>Codul Postal</Form.Label>
                <Form.Control 
                    type="text" 
                    value={postalcode} 
                    placeholder="ex: 600017" 
                    onChange={(e) => setPostalCode(e.target.value)} 
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="city">
                <Form.Label>Orasul</Form.Label>
                <Form.Control 
                    type="text" 
                    value={city} 
                    placeholder="ex: Bacau" 
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-4" controlId='country'>
                <Form.Label>Tara</Form.Label>
                <Form.Control 
                    type="text" 
                    value={country} 
                    placeholder="ex: Romania" 
                    onChange={(e) => setCountry(e.target.value)} 
                    required
                />
            </Form.Group>
            <Button variant="success" type="submit">
                Confirma
            </Button>
        </Form>
    </div>
    )
}
