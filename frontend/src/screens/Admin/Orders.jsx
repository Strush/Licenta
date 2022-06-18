import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LoadingBox from '../../components/LoadingBox';
import Messagebox from '../../components/MessageBox';
import { Store } from '../../Store';
import getError from '../../utils';


const reducer = (state, action) => {
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true}
        case "FECTH_SUCCESS":
            return {...state, orders: action.payload, loading: false}
        case "FETCH_FAIL":
            return {...state, error: action.payload, loading: false}
        default: 
            return state;
    }
}

export default function Orders() {

    const {state} = useContext(Store);
    const {userInfo} = state;

    const [{loading, error, orders}, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try{
                dispatch({type: "FECTH_REQUEST"});
                const {data} = await axios.get('/api/orders', {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });

                dispatch({type: 'FECTH_SUCCESS', payload: data})
            } catch (err){
                dispatch({type: 'FETCH_FAIL', payload: getError(err)})
            }
        }
        fetchData();
    }, [userInfo])

  return (
    <div>
      <Helmet>
        <title>Toate comenzile</title>
      </Helmet>
      <h1 className='mb-3'>Comenzi</h1>
      { loading ? (<LoadingBox/>) 
        :
        error ? (<Messagebox variant="danger">{error}</Messagebox>) 
        :
        (<Table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Ultilizator</th>
                    <th>Data</th>
                    <th>Pretul</th>
                    <th>Platit</th>
                    <th>Livrat</th>
                    <th>Detalii</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((item,index) => (
                    <tr key={item._id}>
                        <td>{index}</td>
                        <td>{item._id}</td>
                        <td>{item.user ? item.user.name : 'User sters'}</td>
                        <td>{item.createdAt.substring(0, 10)}</td>
                        <td>{item.totalPrice}Ron</td>
                        <td>{item.isPaid ? item.createdAt.substring(0, 10) : 'Nu'}</td>
                        <td>{item.isDelivered ? item.deliveredAt.substring(0, 10) : 'Nu'}</td>
                        <td>
                            <Button variant='primary' className='w-100'>
                                <Link className='text-white' to={`/order/${item._id}`} >
                                    Vezi
                                </Link>
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>)
      }
    </div>
  )
}
