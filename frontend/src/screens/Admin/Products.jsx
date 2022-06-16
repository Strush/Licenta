import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingBox from '../../components/LoadingBox';
import Messagebox from '../../components/MessageBox';
import { Store } from '../../Store'
import getError from '../../utils'
import { Helmet } from 'react-helmet-async'
import { Button, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
    switch(action.type){
        case 'FECTH_REQUEST':
            return {...state, loading: true}
        case 'FECTH_SUCCES':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false
            }
        case 'FECTH_FAIL':
            return {
                ...state,
                error: action.payload,
                loading: false,
            }

        case 'CREATE_REQUEST': 
            return {...state, loadingCreate: true}
        case 'CREATE_SUCCES': 
            return {...state, loadingCreate: false}
        case 'CREATE_FAIL':
            return {...state, loadingCreate: false}

        default: 
            return state;
    }
}

export default function Products() {

    const navigate = useNavigate();

    const [{loading, error, pages, products,loadingCreate}, dispatch] = useReducer(reducer, {
        loading: true,
        loadingCreate: false,
        error: ''
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

    const {search} = useLocation();
    const sq = new URLSearchParams(search);
    const page  = sq.get('page') || 1;

    useEffect(() => {
        const fecthData = async () => {
            try {
                const {data} = await axios.get(`/api/products/admin/?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });
                dispatch({type: 'FECTH_SUCCES', payload: data})
            } catch(err) {
                dispatch({type: 'FECTH_FAIL', payload: getError(err)})
            }
        }
        fecthData();
    },[page, userInfo]);

    const createProductHandler = async () => {
        try {
            dispatch({type: 'CREATE_REQUEST'});
            const {data} = await axios.post('/api/products', 
            {},
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
            dispatch({type: 'CREATE_SUCCES'});
            navigate(`/admin/product/${data.product._id}`);
            
        } catch (err) {
            dispatch({type: 'CREATE_FAIL'});
            toast.error(err);
        }
    }

    return (
    <div>
        <Helmet>
            <title>Produse</title>
        </Helmet>
        <Row>
            <Col md={6}>
                <h1 className='mb-3'>Toate Produsele</h1>
            </Col>
            <Col md={6} className="text-r">
                <Button variant='primary'
                    onClick={createProductHandler}
                >
                    Adauga produs
                </Button>
            </Col>
        </Row>
  
        { loading 
            ? (<LoadingBox />) 
            : error ? <Messagebox variant="danger">{error}</Messagebox> 
            : 
            products.lenght !== 0 ? (
                <>
                    <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Nume</th>
                            <th>Pretul</th>
                            <th>In stok</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Actiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((item,i) => (
                                <tr key={item._id}>
                                    <td>{i}</td>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.price}RON</td>
                                    <td>{item.countInStock} produse</td>
                                    <td>{item.category}</td>
                                    <td>{item.brand}</td>
                                    <td>
                                        <Button variant='primary'>
                                            <Link className='text-white' to={`/admin/product/${item._id}`}>
                                                Edit
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                
                <div className='d-flex'>
                    {
                        [...Array(pages).keys()].map((x) => (
                            <Link
                                key={x + 1}
                                className={x + 1 === Number(page) ? 'text-bold me-2' : 'me-2' }
                                to={`/admin/products?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))
                    }
                </div>
                </>
            ) 
            : 'Nu exista nici un produs!'}
    </div>
    )
}
