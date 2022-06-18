import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
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

        case 'DELETE_REQUEST':
            return {...state, loadingDelete: true, successDelete: false}
        case 'DELETE_SUCCESS':
            return {...state, loadingDelete: false, successDelete: true}
        case "DELETE_FAIL":
            return {...state, loadingDelete: false, successDelete: false}
        case "DELETE_RESET":
            return {...state, loadingDelete: false, successDelete: false}

        default: 
            return state
    }
}

export default function ListUsers() {

    const [{loading, error, users, successDelete, loadingDelete}, dispatch] = useReducer(reducer, {
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
        if(successDelete){ 
            dispatch({type: "DELETE_RESET"});
        } else {
            fetchData();
        }
    }, [userInfo,successDelete]);

    const deleteUserHandler = async (user) => {
        if(window.confirm('Sigur doresti sa stergi acest utilizatorul')){
            try{
                dispatch({type: 'DELETE_REQUEST'});
                
                await axios.delete(`/api/users/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });
                dispatch({type: 'DELETE_SUCCESS'});
                toast.success('Utilizatorul a fost sters cu success');
            } catch(err){
                toast.error(getError(err));
                dispatch({type: 'DELETE_FAIL'});
            }
        }
    }

  return (
    <div>
      <Helmet>
        <title>Utilizatori</title>
      </Helmet>
      <h1 className='mb-3'>Utilizatori</h1>
      {loadingDelete && <LoadingBox/>}
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
                                <Button 
                                    variant='danger' 
                                    className='w-50'
                                    onClick={() => deleteUserHandler(user)}
                                >
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
