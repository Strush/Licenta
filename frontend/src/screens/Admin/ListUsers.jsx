import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import LoadingBox from '../../components/LoadingBox'
import Messagebox from '../../components/MessageBox'
import { Store } from '../../Store'
import getError from '../../utils'

const reducer = (state, action) => {
    switch(action.type){
        case 'FECTH_REQUEST':
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {...state, users: action.payload, loading: false}
        case "FETCH_FAIL":
            return {...state, error: action.payload, loading: false}
        default: 
            return state
    }
}

export default function ListUsers() {

    const [{loading, error, users}, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });

    const {state} = useContext(Store);
    const {userInfo} = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({type: 'FECTH_REQUEST'});
                const {data} = await axios.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data });
            } catch(err){
                dispatch({type: 'FECTH_FAIL', payload: getError(err)});
            }
        }
        fetchData();
    }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Utilizatori</title>
      </Helmet>
      <h1 className='mb-3'>Utilizatori</h1>
      {loading ?
        (<LoadingBox />)
        : error ? 
        (<Messagebox variant="danger">{error}</Messagebox>)
        : (
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Administrator</th>
                        <th>Actiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index}</td>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? 'DA' : 'NU'}</td>
                            <td className='d-flex'>
                                <Button variant='primary' className='w-50'>
                                    <Link className='text-white' to={`/admin/user/${user._id}`}>Modifica</Link>
                                </Button>
                                &nbsp;
                                <Button variant='danger' className='w-50'>
                                    Sterge
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
          </Table>
        )}
    </div>
  )
}
