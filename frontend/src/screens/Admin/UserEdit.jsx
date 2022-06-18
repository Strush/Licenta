import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useReducer } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../../components/LoadingBox'
import Messagebox from '../../components/MessageBox'
import { Store } from '../../Store'
import getError from '../../utils'

const reducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST': 
            return {...state, loading: true}
        case 'FECTH_SUCCESS':
            return {...state, loading: false}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}

        case 'UPDATE_REQUEST': 
            return {...state, loadingUpdate: true}
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false}
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false}

        default: 
            return state;
    }
}

export default function UserEdit() {

    const {state} = useContext(Store);
    const {userInfo} = state;

    const {id: userId} = useParams();

    const [{loading, error,loadingUpdate}, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });

    useEffect(() => {
        const fetchData= async () => {
             try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                dispatch({type: 'FECTH_SUCCESS', payload: data});
             } catch(err){
                toast.error(getError(err));
                dispatch({type: 'FETCH_FAIL'});
             }
        }
        fetchData();
    }, [userInfo, userId]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const updateUserHandler = async (e) => {
        e.preventDefault();

        try {
            dispatch({type: 'UPDATE_REQUEST'});

            await axios.put(`/api/users/${userId}`, {
                _id: userId,
                name,
                email,
                isAdmin
            }, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });

            dispatch({type: 'UPDATE_SUCCESS'});
            toast.success('Utilizator modificat cu success');
        } catch(err) {
            toast.error(getError(err));
            dispatch({type: 'UPDATE_FAIL'});
        }
    }

    return (
    <div className='small-container'>
        <Helmet>
            <title>Modifica utilizator</title>
        </Helmet>
        <h1 className='mb-3'>Modifica utilizator: {userId}</h1>
        {loadingUpdate && <LoadingBox/> }
        {loading ? 
            (<LoadingBox />) 
            : error ? (<Messagebox variant="danger">{error}</Messagebox>) :
            (
                <Form className='form'>
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
                    <Form.Check 
                        className='mb-4'
                        type="checkbox"
                        label="Administrator"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    >
                    </Form.Check>
                    <Button 
                        type='sumbit' 
                        variant='primary'
                        onClick={updateUserHandler}
                    >
                        Modifică
                    </Button>
                </Form>
            )
        }
    </div>
    )
}
