import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import getError from '../utils';

export default function SignUp() {

    const navigate = useNavigate();
    const {search} = useLocation();
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectUrl ? redirectUrl : '/';

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if(password !== confirmPassword){
            toast.error('Parolele indroduse nu sunt coincid');
            return;
        }

        try {
            const { data } = await axios.post('/api/users/signup', {
                name,
                email,
                password
            });

        ctxDispatch({type: 'USER_SIGNIN', payload: data});
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate(redirect || '/');

        } catch(err) {
            toast.error(getError(err));
        }
    }

    useEffect(() => {
        if(userInfo) {
            navigate(redirect)
        }
    }, [userInfo,navigate,redirect]);

    return (
        <div className='signup small-container'>
            <Helmet>
                <title>Înregistrați-vă</title>
            </Helmet>
            <h1 className='mb-4 text-center'>Înregistrați-vă</h1>
            <Form onSubmit={submitHandler} className="form">
                <Form.Group controlId="name" className='mb-3 mb-sm-4'>
                    <Form.Label>Nume</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Nume"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="email" className='mb-3 mb-sm-4'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </Form.Group>
                <Form.Group controlId="password" className='mb-3 mb-sm-4'>
                    <Form.Label>Parola</Form.Label>
                    <Form.Control 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword" className='mb-3 mb-sm-4'>
                    <Form.Label>Confirmă parola</Form.Label>
                    <Form.Control 
                        type="password" 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" className='mb-2 w-100' type="submit">
                    Înregistrați-vă
                </Button>
            </Form>
            <div className='form-info__user'>
                <p>Aveţi un cont creat,</p>
                <Link to={`/signin?redirect=${redirect}`}> Autentificare</Link>
            </div>
        </div>
    )
}
