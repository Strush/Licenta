import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function SingIn() {

  const {search} = useLocation();
  const redirectUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectUrl ? redirectUrl : '/';

  return (
    <div className='sign-in small-container'>
        <h1 className='title'>Sign In</h1>
      <form className='form'>
        <div className='form__item'>
            <label htmlFor="email">Email</label>
            <input name="email" type="email" id="email" placeholder="admin@example.com" required />
        </div>
        <div className='form__item'>
            <label htmlFor="password">Password</label>
            <input name="password" type="password" id="password" required />
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
