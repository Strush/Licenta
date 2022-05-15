import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import { Store } from '../Store';

const reducer = (state, action) => {
	switch(action.type){
		case 'FETCH_REQUEST':
			return {...state, loading: true}
		case 'FETCH_SUCCESS':
			return {...state, loading: false}
		case 'FETCH_FAIL':
			return {...state, loading: false}
		default: 
		 return state
	}
}

export default function UserProfile() {

	const [{loading}, dispatch] = useReducer(reducer, {
		loading: false,
	});

	const {state, dispatch: ctxDispatch} = useContext(Store);
	const {userInfo} = state;

	const [name, setName] = useState(userInfo.name);
	const [email, setEmail] = useState(userInfo.email);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const submitHadler = async (e) => {
		e.preventDefault();

		if(password !== confirmPassword) {
			toast.error('Parolele indroduse nu coincid');
			return;
		}
		try {
			dispatch({type: 'FETCH_REQUEST'});
			const {data} = await axios.put('/api/users/profile',{
				name,
				email,
				password
			},{
				headers: {authorization: `Bearer ${userInfo.token}`}
			});
			ctxDispatch({type: 'USER_SIGNIN', payload: data});
			dispatch({type: 'FETCH_SUCCESS'});
			localStorage.setItem('userInfo', JSON.stringify(data));
			toast.success('Date modifcate cu success');
		} catch(err){
			dispatch({type: 'FETCH_FAIL'});
			toast.error(err);
		}
	}

	return (
		<div className='user-profile small-container'>
			<Helmet>
				<title>Profilul meu</title>
			</Helmet>
			<h1>Profilul meu</h1>
			{loading && <LoadingBox />}
			<Form className='form' onSubmit={submitHadler}>
				<Form.Group className='mb-3'>
					<Form.Label>Nume</Form.Label>
					<Form.Control
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>E-mail</Form.Label>
					<Form.Control
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Parola</Form.Label>
					<Form.Control
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Confirma parola</Form.Label>
					<Form.Control
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</Form.Group>
				<Button type='sumbit' variant='success'>
					Modifica
				</Button>
			</Form>
		</div>
	)
}
