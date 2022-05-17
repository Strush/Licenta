import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Store } from '../Store';
import getError from '../utils';

export default function SingIn() {
  const {search} = useLocation();
  const navigate = useNavigate();
  const redirectUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectUrl ? redirectUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {state, dispatch: ctxDispatch} = useContext(Store);
  const {userInfo} = state;

  const submitForm = async(e) => {
    e.preventDefault();

    try {
      const {data} = await axios.post('/api/users/signin',{
        email,
        password
      });
      ctxDispatch({type: 'USER_SIGNIN', payload: data});
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    }catch(err) {
      toast.error(getError(err));
    }
  }

  // Fixarea eroarei daca suntem pe url 'signin'
  useEffect(() => {
    if(userInfo){
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className='signin small-container'>
      <Helmet>Autentificare</Helmet>
      <h1 className='title mb-4 text-center'>Autentificare</h1>
      <Form onSubmit={submitForm} className="form form--signin">
        <Form.Group controlId="email" className='mb-3 mb-sm-4'>
          <Form.Label>Email</Form.Label>
          <Form.Control 
              name="email" 
              type="email" 
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required 
          />
        </Form.Group>
        <Form.Group controlId="password" className='mb-3 mb-sm-4'>
          <Form.Label>Password</Form.Label>
          <Form.Control 
              name="password" 
              type="password" 
              onChange={(e)=> setPassword(e.target.value)} 
              required 
          />
        </Form.Group>
        <Button variant="primary w-100 mb-2" type="submit">Autentificare</Button>
      </Form>
      <div className='form-info__user'>
          <p>Sunteți utilizator nou,</p>
          <Link to={`/signup?redirect=${redirect}`}>Creați-vă un cont.</Link>
      </div>
    </div>
  )
}
