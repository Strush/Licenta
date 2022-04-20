import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
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
    <div className='sign-in small-container'>
        <h1 className='title'>Sign In</h1>
      <form className='form' onSubmit={submitForm}>
        <div className='form__item'>
            <label htmlFor="email">Email</label>
            <input 
              name="email" 
              type="email" 
              id="email" 
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
        </div>
        <div className='form__item'>
            <label htmlFor="password">Password</label>
            <input 
              name="password" 
              type="password" 
              id="password"
              onChange={(e)=> setPassword(e.target.value)} 
              required  
            />
        </div>
        <div className='form__btn'>
            <button type='submit' className='btn btn-teal'>Autentificare</button>
        </div>
      </form>
      <div className='form__new-user'>
          <p>Sunteți utilizator nou,</p>
          <Link to={`/signup?redirect=${redirect}`}> Creați-vă un cont.</Link>
      </div>
    </div>
  )
}
