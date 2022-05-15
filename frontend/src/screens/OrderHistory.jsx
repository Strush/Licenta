import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import getError from '../utils';
import LoadingBox from '../components/LoadingBox';
import Messagebox from '../components/MessageBox';

const reducer = (state, action) => {
	switch(action.type) {
		case 'FETCH_REQUEST':
			return {...state, loading: true}
		case 'FETCH_SUCCESS':
			return {...state, orders: action.payload, loading: false}
		case 'FETCH_FAIL':
			return {...state, error: action.payload, loading: false}
		default: 
		return state;
	}
}

export default function OrderHistory() {

	const {state} = useContext(Store);
	const {userInfo} = state;
	const navigate = useNavigate();

	const [{loading,error,orders}, dispatch] = useReducer(reducer, {
		loading: true,
		error: ''
	});

	useEffect(() => {
		const fetchOrders = async () => {
			dispatch({type: 'FETCH_REQUEST'});
			const {data} = await axios.get('/api/orders/mine', {
				headers: {authorization: `Bearer ${userInfo.token}`}
			});
			try {
				dispatch({type: 'FETCH_SUCCESS', payload: data});
			} catch(err){
				dispatch({type: 'FECTH_FAIL', payload: getError(err)});
			}
		}
		fetchOrders();
	},[userInfo]);

  return (
    <div className='order-history'>
			<Helmet>
				<title>Istoric comenzi</title>
			</Helmet>
      <h1>Istoric comenzi</h1>
			{loading ? (<LoadingBox />) : error ? (<Messagebox />) : (
				<Table bordered hover>
					<thead>
						<tr>
							<th>#</th>
							<th>ID</th>
							<th>Data Comenzi</th>
							<th>Pretul total</th>
							<th>Achitat</th>
							<th>Livrat</th>
							<th>Detalii</th>
						</tr>
					</thead>
					<tbody>
							{orders.map((item,index) => (
								<tr key={item._id}>
									<td>{index}</td>
									<td>{item._id}</td>
									<td>{item.createdAt.substring(0, 10)}</td>
									<td>{item.totalPrice.toFixed(2)}Lei</td>
									<td>{item.isPaid ? item.createdAt.substring(0, 10) : 'NU'}</td>
									<td>{item.isDelivered ? 'DA' : 'NU'}</td>
									<td><Button variant='secondary' onClick={() => navigate(`/order/${item._id}`)}>Detalii</Button></td>
								</tr>
							))}
					</tbody>
				</Table>
			)}
    </div>
  )
}
