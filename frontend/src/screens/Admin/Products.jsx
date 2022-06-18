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

        case 'DELETE_REQUEST': 
            return {...state, loadingDelete: true, successDelete: false}
        case 'DELETE_SUCCESS': 
            return {...state, loadingDelete: false, successDelete: true}
        case 'DELETE_FAIL':
            return {...state, loadingDelete: false, successDelete: false}
        case 'DELETE_RESET':
            return {...state, loadingDelete: false, successDelete: false}

        default: 
            return state;
    }
}

export default function Products() {

    const navigate = useNavigate();

    const [{loading, error, pages, products,loadingCreate,loadingDelete,successDelete}, dispatch] = useReducer(reducer, {
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
        if(successDelete){
            dispatch({type: 'DELETE_RESET'});
        } else {
            fecthData();
        }

    },[page, userInfo,successDelete]);

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

    const deleteProductHandler = async (product) => {
        if(window.confirm('Sigur vrei sa stergi produsul?')){
            try {
                dispatch({type: 'DELETE_REQUEST'});
                await axios.delete(`/api/products/${product._id}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });
                toast.success('Produsul a fost sters cu success');
                dispatch({type: 'DELETE_SUCCESS'});
                
            } catch (err) {
                toast.error(getError(err));
                dispatch({type: 'DELETE_FAIL'});
            }
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
  
        {loadingCreate && <LoadingBox />}
        {loadingDelete && <LoadingBox />}

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
                                    <td className='d-flex justify-content-between'>
                                        <Button variant='primary' className='w-50'>
                                            <Link className='text-white' to={`/admin/product/${item._id}`}>
                                                Edit
                                            </Link>
                                        </Button>
                                        &nbsp;
                                        <Button 
                                            variant='danger'
                                            className='w-50'
                                            type='button'
                                            onClick={() => deleteProductHandler(item)}
                                        > Sterge
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
